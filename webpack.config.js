module.exports = (config) => {
  const extraSilenceDeprecations = [
    "color-functions",
    "mixed-decls",
  ];

  const patchSassLoader = (useEntry) => {
    if (!useEntry || typeof useEntry !== "object") return;
    const loaderName = typeof useEntry.loader === "string" ? useEntry.loader : "";
    if (!loaderName.includes("sass-loader")) return;

    useEntry.options ??= {};
    useEntry.options.sassOptions ??= {};

    const existing = useEntry.options.sassOptions.silenceDeprecations ?? [];
    const merged = Array.from(new Set([...existing, ...extraSilenceDeprecations]));

    useEntry.options.sassOptions = {
      ...useEntry.options.sassOptions,
      quietDeps: true,
      silenceDeprecations: merged,
    };
  };

  const visitRules = (rules) => {
    if (!Array.isArray(rules)) return;

    for (const rule of rules) {
      if (rule.oneOf) visitRules(rule.oneOf);
      if (rule.rules) visitRules(rule.rules);

      const use = rule.use;
      if (Array.isArray(use)) use.forEach(patchSassLoader);
      else patchSassLoader(use);

      patchSassLoader(rule);
    }
  };

  visitRules(config.module?.rules);
  return config;
};
