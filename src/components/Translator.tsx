import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { en, patterns } from "@/i18n/dictionary";

const originals = new WeakMap<Node, string>();
const attrOriginals = new WeakMap<Element, Record<string, string>>();
const ATTRS = ["placeholder", "aria-label", "title", "alt"];

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function translateText(raw: string): string | null {
  const key = norm(raw);
  if (!key) return null;
  let hit = en[key];
  if (!hit) {
    let out = key;
    for (const [re, rep] of patterns) out = out.replace(re, rep);
    if (out === key) return null;
    hit = out;
  }
  // preserve leading/trailing whitespace of the original node
  const lead = raw.match(/^\s*/)?.[0] ?? "";
  const trail = raw.match(/\s*$/)?.[0] ?? "";
  return lead + hit + trail;
}

function walk(root: Node, toEnglish: boolean) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT")
        return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const node of nodes) {
    if (toEnglish) {
      const source = originals.get(node) ?? node.nodeValue ?? "";
      const next = translateText(source);
      if (next && next !== node.nodeValue) {
        if (!originals.has(node)) originals.set(node, source);
        node.nodeValue = next;
      }
    } else {
      const original = originals.get(node);
      if (original !== undefined && original !== node.nodeValue) node.nodeValue = original;
    }
  }

  const elements: Element[] = [];
  if (root instanceof Element) elements.push(root);
  if (root instanceof Element || root instanceof Document) {
    elements.push(...Array.from((root as Element | Document).querySelectorAll("*")));
  }

  for (const el of elements) {
    for (const attr of ATTRS) {
      const value = el.getAttribute(attr);
      if (value == null) continue;
      if (toEnglish) {
        const stored = attrOriginals.get(el) ?? {};
        const source = stored[attr] ?? value;
        const next = translateText(source);
        if (next && next !== value) {
          stored[attr] = source;
          attrOriginals.set(el, stored);
          el.setAttribute(attr, next);
        }
      } else {
        const stored = attrOriginals.get(el);
        if (stored && stored[attr] !== undefined) el.setAttribute(attr, stored[attr]);
      }
    }
  }
}

/**
 * Runtime translation layer: swaps Swedish copy for English across the whole
 * page (including dynamically rendered content) without duplicating routes.
 */
export function Translator() {
  const { locale } = useLanguage();

  useEffect(() => {
    const toEnglish = locale === "en";
    walk(document.body, toEnglish);

    if (!toEnglish) return;

    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        observer.disconnect();
        walk(document.body, true);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ATTRS,
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
    return () => observer.disconnect();
  }, [locale]);

  return null;
}
