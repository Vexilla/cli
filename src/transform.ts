import Case from "case";

const disclaimerText =
  "This file has been generated from your remote Vexilla Feature Flags file. You should NOT modify this file directly. It is encouraged to gitignore this file and generate it on the fly during build/compilation.";

const languageTransformers: Record<
  string,
  (tags: string[], keys: string[]) => string
> = {
  js: function (tags: string[], keys: string[]) {
    const tagsString = tags
      .map((tag: string) => `  ${Case.camel(tag)}: "${tag}",`)
      .join("\n");

    const keysString = keys
      .map((key: string) => `  ${Case.camel(key)}: "${key}",`)
      .join("\n");

    return `// ${disclaimerText}

export const VexillaTags = {
${tagsString}
};

export const VexillaKeys = {
${keysString}
};
`;
  },
  ts: function (tags: string[], keys: string[]) {
    const tagsString = tags
      .map((tag: string) => `  ${Case.pascal(tag)} = "${tag}",`)
      .join("\n");

    const keysString = keys
      .map((key: string) => `  ${Case.pascal(key)} = "${key}",`)
      .join("\n");

    return `// ${disclaimerText}

export enum VexillaTags {
${tagsString}
};

export enum VexillaKeys {
${keysString}
};
`;
  },
  elixir: function (tags: string[], keys: string[]) {
    const tagsString = tags
      .map((tag: string) => `:vexilla_tag_${Case.snake(tag)} = "${tag}"`)
      .join("\n");

    const keysString = keys
      .map((key: string) => `:vexilla_key_${Case.snake(key)} = "${key}"`)
      .join("\n");

    return `# ${disclaimerText}

# Tags
${tagsString}

# Keys
${keysString}
`;
  },
  php: function (tags: string[], keys: string[]) {
    const tagsString = tags
      .map((tag: string) => `  public static $${Case.camel(tag)} = "${tag}";`)
      .join("\n");

    const keysString = keys
      .map((key: string) => `  public static $${Case.camel(key)} = "${key}";`)
      .join("\n");

    return `<?php
namespace Vexilla;

// ${disclaimerText}

// Tags
class Tags {
${tagsString}
}

// Keys
class Keys {
${keysString}
}
`;
  },
  go: function (tags: string[], keys: string[]) {
    const tagsString = tags
      .map(
        (tag: string) => `const VexillaTag${Case.pascal(tag)} string = "${tag}"`
      )
      .join("\n");

    const keysString = keys
      .map(
        (key: string) => `const VexillaKey${Case.pascal(key)} string = "${key}"`
      )
      .join("\n");

    return `// ${disclaimerText}

package vexillaMain

// Tags
${tagsString}

// Keys
${keysString}
`;
  },
  rust: function (tags: string[], keys: string[]) {
    const tagsString = tags
      .map(
        (tag: string) =>
          `static VEXILLA_TAG_${Case.constant(tag)}: &str = "${tag}";`
      )
      .join("\n");

    const keysString = keys
      .map(
        (key: string) =>
          `static VEXILLA_KEY_${Case.constant(key)}: &str = "${key}";`
      )
      .join("\n");

    return `// ${disclaimerText}

// Tags
${tagsString}

// Keys
${keysString}
`;
  },
};

export function transformConstants(
  language: string,
  tags: string[],
  keys: string[]
) {
  const transformer = languageTransformers[language.toLowerCase()];

  if (!transformer) {
    throw new Error(`No Transformer found for language: ${language}`);
  }
  return transformer(tags, keys);
}
