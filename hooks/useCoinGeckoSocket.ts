/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';

const WS_URL =
  process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL ||
  'wss://stream.coingecko.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

type ChannelState = {
  subscribers: Set<(msg: any) => void>;
  coins: Set<string>;
  ready: boolean;
};

type UseCoinGeckoSocketProps = {
  channel: string;
  subscribeParams?: string[]; // e.g., coinIds
  subscribeMessage: (coins: string[]) => any;
  onReady?: () => void;
  onData: (msg: any) => void;
};

// --- Shared socket and state ---
let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
const messageQueue: any[] = [];
const channels = new Map<string, ChannelState>();

export const useCoinGeckoSocket = ({
  channel,
  subscribeParams = [],
  subscribeMessage,
  onReady,
  onData,
}: UseCoinGeckoSocketProps) => {
  const onDataRef = useRef(onData);
  const onReadyRef = useRef(onReady);
  const paramsRef = useRef(subscribeParams);

  // keep latest refs
  useEffect(() => {
    onDataRef.current = onData;
    onReadyRef.current = onReady;
    paramsRef.current = subscribeParams;
  }, [onData, onReady, subscribeParams]);

  useEffect(() => {
    if (!API_KEY) return;

    // --- Initialize channel state ---
    if (!channels.has(channel)) {
      channels.set(channel, {
        subscribers: new Set(),
        coins: new Set(),
        ready: false,
      });
    }
    const channelState = channels.get(channel)!;

    // Add subscriber and merge coins
    channelState.subscribers.add(onDataRef.current);
    subscribeParams.forEach((c) => channelState.coins.add(c));

    // --- Safe send function: always queue messages ---
    const safeSend = (msg: any) => {
      if (!socket) return;
      messageQueue.push(msg);
      if (socket.readyState === WebSocket.OPEN) {
        while (messageQueue.length > 0) {
          const m = messageQueue.shift();
          socket!.send(JSON.stringify(m));
        }
      }
    };

    // --- Connect shared socket ---
    if (!socket) {
      const connect = () => {
        socket = new WebSocket(`${WS_URL}?x_cg_pro_api_key=${API_KEY}`);

        socket.onopen = () => {
          // flush queue
          while (messageQueue.length > 0) {
            const m = messageQueue.shift();
            socket!.send(JSON.stringify(m));
          }
        };

        socket.onmessage = (event) => {
          const msg = JSON.parse(event.data);

          // ping → pong
          if (msg.type === 'ping') {
            safeSend({ type: 'pong' });
            return;
          }

          // welcome → subscribe all channels
          if (msg.type === 'welcome') {
            channels.forEach((_state, ch) => {
              safeSend({
                command: 'subscribe',
                identifier: JSON.stringify({ channel: ch }),
              });
            });
            return;
          }

          // confirm_subscription → ready → send merged coins
          if (msg.type === 'confirm_subscription') {
            const ch = JSON.parse(msg.identifier).channel;
            const state = channels.get(ch);
            if (!state) return;

            state.ready = true;

            if (state.coins.size > 0) {
              safeSend(subscribeMessage(Array.from(state.coins)));
            }

            onReadyRef.current?.();
            return;
          }

          // real data
          if (msg.c) {
            channels.forEach((state) =>
              state.subscribers.forEach((fn) => fn(msg))
            );
          }
        };

        socket.onclose = () => {
          reconnectTimer = setTimeout(connect, 1000);
        };
      };

      connect();
    } else if (channelState.ready) {
      safeSend(subscribeMessage(Array.from(channelState.coins)));
    }

    // --- Cleanup on unmount ---
    return () => {
      channelState.subscribers.delete(onDataRef.current);
      subscribeParams.forEach((c) => channelState.coins.delete(c));

      if (channelState.subscribers.size === 0) {
        safeSend({
          command: 'unsubscribe',
          identifier: JSON.stringify({ channel }),
        });
        channels.delete(channel);
      }

      if (channels.size === 0) {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        socket?.close();
        socket = null;
        messageQueue.length = 0;
      }
    };
  }, [channel, subscribeMessage]);
};
