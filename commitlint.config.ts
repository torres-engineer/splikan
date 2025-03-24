import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  formatter: "@commitlint/format",
  rules: {
    // "body-max-line-length": [RuleConfigSeverity.Error, "always", 80],
    // "footer-max-line-length": [RuleConfigSeverity.Error, "always", 80],
    "scope-enum": [RuleConfigSeverity.Error, "always", [
      "server",
      "client",
    ]],
  },
  ignores: [(commit) => commit === ""],
  defaultIgnores: true,
  helpUrl:
    "https://github.com/conventional-changelog/commitlint/#what-is-commitlint",
};

export default Configuration;
