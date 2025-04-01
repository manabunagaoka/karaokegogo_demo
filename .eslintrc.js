module.exports = {
  extends: "next/core-web-app",
  rules: {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "warn",
    "@next/next/no-img-element": "warn"
  }
}
