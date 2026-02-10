import { useState, useCallback, useRef, useEffect } from "react";

/**
 * A hook that tracks whether an image element has finished loading.
 *
 * Handles all edge cases:
 * - Image already cached/complete on mount
 * - Normal load via event listener
 * - Errors (resets to `false`)
 * - `src` changes (resets to `false` until the new source loads)
 * - Element unmount / ref set to `null`
 *
 * @returns `[ref, isLoaded]` — attach the ref callback to an `<img>` element.
 *
 * @example
 * ```tsx
 * function Avatar({ src }: { src: string }) {
 *   const [imgRef, isLoaded] = useImgLoaded(src);
 *   return (
 *     <img
 *       ref={imgRef}
 *       src={src}
 *       style={{ opacity: isLoaded ? 1 : 0 }}
 *     />
 *   );
 * }
 * ```
 */
export function useImgLoaded(
  src: string | undefined,
): [(img: HTMLImageElement | null) => void, boolean] {
  const [state, setState] = useState<{ src: string | undefined; loaded: boolean }>({
    src,
    loaded: false,
  });

  // Reset when src changes — derived state pattern with no refs during render
  let isLoaded = state.loaded;
  if (state.src !== src) {
    isLoaded = false;
    setState({ src, loaded: false });
  }

  const imgRef = useRef<HTMLImageElement | null>(null);

  const onLoad = useCallback(
    () => setState((prev) => ({ ...prev, loaded: true })),
    [],
  );
  const onError = useCallback(
    () => setState((prev) => ({ ...prev, loaded: false })),
    [],
  );

  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      const prev = imgRef.current;
      if (prev) {
        prev.removeEventListener("load", onLoad);
        prev.removeEventListener("error", onError);
      }

      imgRef.current = img;

      if (!img) return;

      // Image may already be cached / complete
      if (img.complete && img.naturalWidth > 0) {
        setState((prev) => ({ ...prev, loaded: true }));
      }

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
    },
    [onLoad, onError],
  );

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      const img = imgRef.current;
      if (img) {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      }
    };
  }, [onLoad, onError]);

  return [ref, isLoaded];
}
