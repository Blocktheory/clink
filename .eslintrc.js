module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            node: {
                paths: ["src"],
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },
    env: {
        browser: true,
        amd: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    plugins: ["simple-import-sort", "prettier"],
    rules: {
        "prettier/prettier": [
            "error",
            {},
            {
                usePrettierrc: true,
            },
        ],
        "react/react-in-jsx-scope": "off",
        "jsx-a11y/accessible-emoji": "off",
        "react/prop-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "react/no-unescaped-entities": 0,
        "jsx-a11y/anchor-is-valid": [
            "error",
            {
                components: ["Link"],
                specialLink: ["hrefLeft", "hrefRight"],
                aspects: ["invalidHref", "preferButton"],
            },
        ],
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "variable",
                format: ["camelCase", "PascalCase", "UPPER_CASE"],
                leadingUnderscore: "allow",
            },
            {
                selector: "function",
                format: ["camelCase", "PascalCase"],
            },
            {
                selector: "class",
                format: ["PascalCase"],
            },
            {
                selector: "parameter",
                format: ["camelCase", "PascalCase", "snake_case"],
                leadingUnderscore: "allow",
            },
            {
                selector: "typeLike",
                format: ["PascalCase"],
                prefix: ["K", "P", "T", "U", "V"],
            },
            {
                selector: "interface",
                format: ["PascalCase"],
                prefix: ["I", "J", "K"],
            },
            {
                selector: "enum",
                format: ["UPPER_CASE"],
            },
        ],
    },
};
