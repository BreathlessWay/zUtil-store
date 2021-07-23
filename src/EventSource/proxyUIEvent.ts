import { getDomPath } from "utils/getDomPath";
import { getDomPathWithIndex } from "utils/getDomPathWithIndex";
import { getRelativePosition } from "utils/getRelativePosition";
import { getDomContent } from "utils/getDomContent";

export const proxyUIEvent = (collectEventData: Function) => {
  const originAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function <
    K extends keyof HTMLElementEventMap
  >(
    type: K,
    listener: (ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    let listenerWrap = (ev: HTMLElementEventMap[K]) => {
      if (type === "click") {
        const domPath = getDomPath(ev),
          domPathWithIndex = getDomPathWithIndex(ev),
          relativePosition = getRelativePosition(ev),
          domContent = getDomContent(ev);
        console.log(relativePosition, domPathWithIndex, domPath, domContent);
        collectEventData(ev);
      }
      if (type === "scroll") {
        collectEventData(ev);
      }

      listener.call(this, ev);
    };

    return originAddEventListener.call(
      this,
      type,
      listenerWrap as EventListener,
      options
    );
  };

  Object.defineProperty(EventTarget.prototype, "onclick", {
    set(fun) {
      this.addEventListener("click", fun);
    },
  });
  Object.defineProperty(EventTarget.prototype, "scroll", {
    set(fun) {
      this.addEventListener("scroll", fun);
    },
  });

  window.addEventListener("click", (ev) => {});
  window.addEventListener("scroll", (ev) => {});
};