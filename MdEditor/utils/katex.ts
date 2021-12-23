export default {
  block(prefix: string, katex: any) {
    return {
      name: 'KaTexBlockExtension',
      level: 'block',
      start: (text: string) => text.match(/\$\$\n/)?.index,
      tokenizer(text: string) {
        const reg = /^\$\$\n([^$]*)\$\$\n?/;
        const match = reg.exec(text);

        if (match) {
          const token = {
            type: 'KaTexBlockExtension',
            raw: match[0],
            text: match[1].trim(),
            tokens: []
          };

          return token;
        }
      },
      renderer(token: any) {
        const html = katex.renderToString(token.text, {
          throwOnError: false
        });

        return `<span class="${prefix}-katex-block">${html}</span>`;
      }
    };
  },
  inline(prefix: string, katex: any) {
    return {
      name: 'KaTexInlineExtension',
      level: 'inline',
      start: (text: string) => text.match(/\$[^$]/)?.index,
      tokenizer(text: string) {
        const reg = /^\$([^$]*)\$/;
        const match = reg.exec(text);

        if (match) {
          const token = {
            type: 'KaTexInlineExtension',
            raw: match[0],
            text: match[1].trim(),
            tokens: []
          };

          return token;
        }
      },
      renderer(token: any) {
        const html = katex.renderToString(token.text, {
          throwOnError: false
        });

        return `<span class="${prefix}-katex-inline">${html}</span>`;
      }
    };
  }
};
