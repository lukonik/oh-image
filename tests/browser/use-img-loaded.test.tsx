import { cleanup, renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useImgLoaded } from "../../src/react/use-img-loaded";

function createMockImg(overrides: Partial<HTMLImageElement> = {}) {
  const listeners: Record<string, EventListener[]> = {};
  return {
    complete: false,
    naturalWidth: 0,
    ...overrides,
    addEventListener: vi.fn((event: string, handler: EventListener) => {
      listeners[event] ??= [];
      listeners[event].push(handler);
    }),
    removeEventListener: vi.fn((event: string, handler: EventListener) => {
      listeners[event] = (listeners[event] ?? []).filter((h) => h !== handler);
    }),
    _fire(event: string) {
      for (const handler of listeners[event] ?? []) {
        handler(new Event(event));
      }
    },
  } as unknown as HTMLImageElement & { _fire: (event: string) => void };
}

describe("useImgLoaded", () => {
  afterEach(() => {
    cleanup();
  });

  it("returns isLoaded=false initially", () => {
    const { result } = renderHook(() => useImgLoaded("/img.jpg"));
    expect(result.current[1]).toBe(false);
  });

  it("sets isLoaded=true when load event fires", () => {
    const img = createMockImg();
    const { result } = renderHook(() => useImgLoaded("/img.jpg"));

    act(() => {
      result.current[0](img);
    });
    expect(result.current[1]).toBe(false);

    act(() => {
      img._fire("load");
    });
    expect(result.current[1]).toBe(true);
  });

  it("sets isLoaded=true immediately if image is already complete", () => {
    const img = createMockImg({ complete: true, naturalWidth: 100 });
    const { result } = renderHook(() => useImgLoaded("/img.jpg"));

    act(() => {
      result.current[0](img);
    });
    expect(result.current[1]).toBe(true);
  });

  it("does not set isLoaded=true if complete but naturalWidth is 0 (broken)", () => {
    const img = createMockImg({ complete: true, naturalWidth: 0 });
    const { result } = renderHook(() => useImgLoaded("/img.jpg"));

    act(() => {
      result.current[0](img);
    });
    expect(result.current[1]).toBe(false);
  });

  it("resets isLoaded=false on error event", () => {
    const img = createMockImg();
    const { result } = renderHook(() => useImgLoaded("/img.jpg"));

    act(() => {
      result.current[0](img);
    });
    act(() => {
      img._fire("load");
    });
    expect(result.current[1]).toBe(true);

    act(() => {
      img._fire("error");
    });
    expect(result.current[1]).toBe(false);
  });

  it("resets isLoaded=false when src changes", () => {
    const img = createMockImg();
    const { result, rerender } = renderHook(
      ({ src }) => useImgLoaded(src),
      { initialProps: { src: "/a.jpg" } },
    );

    act(() => {
      result.current[0](img);
    });
    act(() => {
      img._fire("load");
    });
    expect(result.current[1]).toBe(true);

    rerender({ src: "/b.jpg" });
    expect(result.current[1]).toBe(false);
  });

  it("removes event listeners from previous element when ref changes", () => {
    const img1 = createMockImg();
    const img2 = createMockImg();
    const { result } = renderHook(() => useImgLoaded("/img.jpg"));

    act(() => {
      result.current[0](img1);
    });
    expect(img1.addEventListener).toHaveBeenCalledTimes(2);

    act(() => {
      result.current[0](img2);
    });
    expect(img1.removeEventListener).toHaveBeenCalledTimes(2);
    expect(img2.addEventListener).toHaveBeenCalledTimes(2);
  });

  it("removes event listeners when ref is set to null", () => {
    const img = createMockImg();
    const { result } = renderHook(() => useImgLoaded("/img.jpg"));

    act(() => {
      result.current[0](img);
    });

    act(() => {
      result.current[0](null);
    });
    expect(img.removeEventListener).toHaveBeenCalledTimes(2);
  });

  it("cleans up event listeners on unmount", () => {
    const img = createMockImg();
    const { result, unmount } = renderHook(() => useImgLoaded("/img.jpg"));

    act(() => {
      result.current[0](img);
    });

    unmount();
    expect(img.removeEventListener).toHaveBeenCalled();
  });
});
