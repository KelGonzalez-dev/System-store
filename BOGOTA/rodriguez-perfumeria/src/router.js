export const go = (target) => window.dispatchEvent(new CustomEvent('rp:go', { detail: target }));

export const link = (target, after) => ({
  href: target,
  onClick: (e) => {
    e.preventDefault();
    go(target);
    after?.();
  },
});
