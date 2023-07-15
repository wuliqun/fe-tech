import { Directive } from "vue";
import { throttle } from "UTILS/throttle";

function getBlurImage(src: string) {
  return `${src}?imageMogr2/thumbnail/20x`;
}

let observer: IntersectionObserver | null = null;
let lazyImgs: Set<HTMLImageElement>;
let showImg: (() => void) | null = null;
if (window.IntersectionObserver) {
  observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute("lazy");
        if (src && src !== img.src) {
          img.src = src;
          observer.unobserve(img);
        }
      }
    });
  });
} else {
  lazyImgs = new Set();
  showImg = throttle(
    () => {
      const { availHeight: height, availWidth: width } = window.screen;
      lazyImgs.forEach((img) => {
        const src = img.getAttribute("lazy");
        if (src && src !== img.src) {
          const rect = img.getBoundingClientRect();
          // 出现在视口内
          if (
            !(
              rect.bottom < 0 ||
              rect.top > height ||
              rect.left > width ||
              rect.right < 0
            )
          ) {
            img.src = src;
            lazyImgs.delete(img);
          }
        }
      });
    },
    100,
    true
  );

  // scroll  resize  orientationchange
  window.addEventListener("scroll", showImg);
}

const vLazy: Directive<HTMLImageElement, string> = {
  mounted(el, binding) {
    el.src = getBlurImage(binding.value);
    el.setAttribute("lazy", binding.value);
    if (observer) {
      observer.observe(el);
    } else {
      lazyImgs.add(el);
      el.onload = () => {
        showImg?.();
        el.onload = null;
      };
    }
  },
  beforeUpdate(el, binding) {
    if (binding.value !== binding.oldValue) {
      if (el.src === binding.oldValue) {
        el.src = binding.value;
      } else {
        el.src = getBlurImage(binding.value);
      }
    }
  },
  beforeUnmount(el) {
    if (observer) {
      observer.unobserve(el);
    } else {
      lazyImgs.delete(el);
    }
  },
};

export default vLazy;
