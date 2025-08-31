import { signal } from "@preact/signals-react";

export const textSignal = signal<string>("");

export function appendText(t: string) {
  textSignal.value += t;
}
