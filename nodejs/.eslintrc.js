const OFF = 'off';
const ERROR = 'error';
const WARN = 'warn';

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    globals: {
        "NodeJS": true,
    },
    plugins: [
        'jest',
        '@typescript-eslint',
        'eslint-plugin-import'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    env: {
        node: true,
        es6: true,
        jest: true
    },
    rules: {
        '@typescript-eslint/no-non-null-asserted-optional-chain': OFF,
        '@typescript-eslint/no-unused-vars': ERROR,
        '@typescript-eslint/no-explicit-any': [ ERROR, { ignoreRestArgs: false, fixToUnknown: false } ],
        '@typescript-eslint/ban-ts-ignore': OFF,
        '@typescript-eslint/no-namespace': [ OFF ],
        '@typescript-eslint/no-empty-interface': OFF,
        'import/order': [ ERROR, {
            'newlines-between': 'always-and-inside-groups',
            groups: [ 'builtin', 'external', 'parent', 'sibling', 'index' ],
            pathGroupsExcludedImportTypes: [ 'builtin' ]
        } ],
        curly: [ ERROR, 'all' ],
        '@typescript-eslint/naming-convention': [
            ERROR,
            {
                selector: 'interface',
                format: [ 'PascalCase' ],
                custom: {
                    regex: '^[A-Z]',
                    match: true
                }
            }
        ],

        /**
         * ESlint recommended
         */

        // require super() calls in constructors
        'constructor-super': ERROR,

        // enforce “for” loop update clause moving the counter in the right direction.
        'for-direction': ERROR,

        // enforce return statements in getters
        'getter-return': OFF,

        // disallow lexical declarations in case clauses
        'no-case-declarations': OFF,

        // disallow reassigning class members
        'no-class-assign': ERROR,

        // disallow comparing against -0
        'no-compare-neg-zero': ERROR,

        // disallow assignment operators in conditional expressions
        'no-cond-assign': [ ERROR, 'always' ],

        // disallow the use of console
        'no-console': ERROR,

        // disallow reassigning const variables
        'no-const-assign': ERROR,

        // disallow constant expressions in conditions
        'no-constant-condition': ERROR,

        // disallow control characters in regular expressions
        'no-control-regex': ERROR,

        // disallow the use of debugger
        'no-debugger': ERROR,

        // disallow deleting variables
        'no-delete-var': ERROR,

        // disallow duplicate arguments in function definitions
        'no-dupe-args': ERROR,

        // disallow duplicate class members
        'no-dupe-class-members': ERROR,

        // disallow duplicate keys in object literals
        'no-dupe-keys': ERROR,

        // disallow duplicate case labels
        'no-duplicate-case': ERROR,

        // disallow empty block statements
        'no-empty': [ ERROR, { allowEmptyCatch: true } ], /* Changed! TODO */

        // disallow empty character classes in regular expressions
        'no-empty-character-class': ERROR,

        // disallow empty destructuring patterns
        'no-empty-pattern': ERROR,

        // disallow reassigning exceptions in catch clauses
        'no-ex-assign': ERROR,

        // disallow unnecessary boolean casts
        'no-extra-boolean-cast': ERROR,

        // disallow unnecessary semicolons
        'no-extra-semi': ERROR,

        // disallow fallthrough of case statements
        'no-fallthrough': ERROR,

        // disallow reassigning function declarations
        'no-func-assign': ERROR,

        // disallow assignments to native objects or read-only global variables
        'no-global-assign': ERROR,

        // disallow variable or function declarations in nested blocks
        'no-inner-declarations': ERROR,

        // disallow invalid regular expression strings in RegExp constructors
        'no-invalid-regexp': ERROR,

        // disallow irregular whitespace
        'no-irregular-whitespace': ERROR,

        // disallow mixed spaces and tabs for indentation
        'no-mixed-spaces-and-tabs': ERROR,

        // disallow new operators with the Symbol object
        'no-new-symbol': ERROR,

        // disallow calling global object properties as functions
        'no-obj-calls': ERROR,

        // disallow octal literals
        'no-octal': ERROR,

        // disallow variable redeclaration
        'no-redeclare': ERROR,

        // disallow multiple spaces in regular expressions
        'no-regex-spaces': ERROR,

        // disallow assignments where both sides are exactly the same
        'no-self-assign': ERROR,

        // disallow sparse arrays
        'no-sparse-arrays': ERROR,

        // disallow this/super before calling super() in constructors
        'no-this-before-super': ERROR,

        // disallow the use of undeclared variables unless mentioned in /*global */ comments
        'no-undef': ERROR,

        // disallow confusing multiline expressions
        'no-unexpected-multiline': ERROR,

        // disallow unreachable code after return, throw, continue, and break statements
        'no-unreachable': ERROR,

        // disallow control flow statements in finally blocks
        'no-unsafe-finally': ERROR,

        // disallow negating the left operand of relational operators
        'no-unsafe-negation': ERROR,

        // disallow unused labels
        'no-unused-labels': ERROR,

        // disallow unused variables
        'no-unused-vars': [ ERROR, {
            vars: 'local',
            args: 'after-used'
        } ],

        // disallow unnecessary escape characters
        'no-useless-escape': OFF, /* Changed! TODO */

        'no-nonoctal-decimal-escape': OFF,

        'no-unsafe-optional-chaining': OFF,

        // require generator functions to contain yield
        'require-yield': ERROR,

        // require calls to isNaN() when checking for NaN
        'use-isnan': ERROR,

        // enforce comparing typeof expressions against valid strings
        'valid-typeof': ERROR,

        /**
         * Possible errors
         */

        // disallow using an async function as a Promise executor
        'no-async-promise-executor': ERROR,

        // disallow unnecessary parentheses
        'no-extra-parens': [ ERROR, 'functions' ],

        // disallow characters which are made with multiple code points in character class syntax
        'no-misleading-character-class': ERROR,

        // disallow calling some Object.prototype methods directly on objects
        'no-prototype-builtins': OFF,

        // disallow template literal placeholder syntax in regular strings
        'no-template-curly-in-string': ERROR,

        // disallow assignments that can lead to race conditions due to usage of await or yield
        'require-atomic-updates': ERROR,

        /**
         * Best practices
         */

        // enforce getter and setter pairs in objects
        'accessor-pairs': OFF,

        // enforce return statements in callbacks of array methods
        'array-callback-return': OFF,

        // enforce the use of variables within the scope they are defined
        'block-scoped-var': ERROR,

        // enforce that class methods utilize this
        'class-methods-use-this': OFF,

        // enforce a maximum cyclomatic complexity allowed in a program
        complexity: [ WARN, 20 ],

        // require return statements to either always or never specify values (changed)
        'consistent-return': OFF,

        // require default cases in switch statements
        'default-case': ERROR,

        // enforce consistent newlines before and after dots
        'dot-location': [ ERROR, 'property' ],

        // enforce dot notation whenever possible
        'dot-notation': [ WARN, { allowKeywords: true } ],

        // require the use of === and !==
        eqeqeq: ERROR,

        // require for-in loops to include an if statement
        'guard-for-in': ERROR,

        // enforce a maximum number of classes per file
        'max-classes-per-file': OFF,

        // disallow the use of alert, confirm, and prompt
        'no-alert': ERROR,

        // disallow the use of arguments.caller or arguments.callee
        'no-caller': ERROR,

        // disallow division operators explicitly at the beginning of regular expressions
        'no-div-regex': ERROR,

        // disallow else blocks after return statements in if statements
        'no-else-return': ERROR,

        // disallow empty functions
        'no-empty-function': OFF,

        // disallow null comparisons without type-checking operators
        'no-eq-null': ERROR,

        // disallow the use of eval()
        'no-eval': ERROR,

        // disallow extending native types
        'no-extend-native': ERROR,

        // disallow unnecessary calls to .bind()
        'no-extra-bind': ERROR,

        // disallow unnecessary labels
        'no-extra-label': ERROR,

        // disallow leading or trailing decimal points in numeric literals
        'no-floating-decimal': ERROR,

        // disallow shorthand type conversions
        'no-implicit-coercion': ERROR,

        // disallow variable and function declarations in the global scope
        'no-implicit-globals': ERROR,

        // disallow the use of eval()-like methods
        'no-implied-eval': ERROR,

        // disallow this keywords outside of classes or class-like objects
        'no-invalid-this': OFF,

        // disallow the use of the __iterator__ property
        'no-iterator': ERROR,

        // disallow labeled statements
        'no-labels': ERROR,

        // disallow unnecessary nested blocks
        'no-lone-blocks': ERROR,

        // disallow function declarations and expressions inside loop statements
        'no-loop-func': ERROR,

        // disallow magic numbers
        'no-magic-numbers': OFF,

        // disallow multiple spaces
        'no-multi-spaces': [ ERROR, { ignoreEOLComments: true } ],

        // disallow multiline strings
        'no-multi-str': ERROR,

        // disallow new operators outside of assignments or comparisons
        'no-new': ERROR,

        // disallow new operators with the Function object
        'no-new-func': ERROR,

        // disallow new operators with the String, Number, and Boolean objects
        'no-new-wrappers': ERROR,

        // disallow octal escape sequences in string literals
        'no-octal-escape': ERROR,

        // disallow reassigning function parameters (changed)
        'no-param-reassign': OFF,

        // disallow the use of the __proto__ property
        'no-proto': ERROR,

        // disallow certain properties on certain objects
        'no-restricted-properties': ERROR,

        // disallow assignment operators in return statements (changed)
        'no-return-assign': OFF,

        // disallow unnecessary return await
        'no-return-await': ERROR,

        // disallow javascript: urls
        'no-script-url': ERROR,

        // disallow comparisons where both sides are exactly the same
        'no-self-compare': ERROR,

        // disallow comma operators
        'no-sequences': ERROR,

        // disallow throwing literals as exceptions (changed)
        'no-throw-literal': OFF,

        // disallow unmodified loop conditions
        'no-unmodified-loop-condition': ERROR,

        // disallow unused expressions (changed)
        'no-unused-expressions': OFF,

        // disallow unnecessary calls to .call() and .apply()
        'no-useless-call': ERROR,

        // disallow unnecessary catch clauses
        'no-useless-catch': ERROR,

        // disallow unnecessary concatenation of literals or template literals
        'no-useless-concat': OFF,

        // disallow redundant return statements
        'no-useless-return': OFF,

        // disallow void operators
        'no-void': ERROR,

        // disallow specified warning terms in comments
        'no-warning-comments': OFF,

        // disallow with statements
        'no-with': ERROR,

        // enforce using named capture group in regular expression
        'prefer-named-capture-group': OFF,

        // require using Error objects as Promise rejection reasons
        'prefer-promise-reject-errors': OFF,

        // enforce the consistent use of the radix argument when using parseInt()
        radix: ERROR,

        // disallow async functions which have no await expression
        'require-await': ERROR,

        // enforce the use of u flag on RegExp
        'require-unicode-regexp': OFF,

        // require var declarations be placed at the top of their containing scope
        'vars-on-top': ERROR,

        // require parentheses around immediate function invocations
        'wrap-iife': [ ERROR, 'any' ],

        // require or disallow “Yoda” conditions
        yoda: ERROR,

        /**
         * Strict Mode
         */

        // require or disallow strict mode directives
        strict: OFF,

        /**
         * Variables
         */

        // require or disallow initialization in variable declarations
        'init-declarations': OFF,

        // disallow labels that share a name with a variable
        'no-label-var': ERROR,

        // disallow specified global variables
        'no-restricted-globals': ERROR,

        // disallow identifiers from shadowing restricted names
        'no-shadow-restricted-names': ERROR,

        // disallow initializing variables to undefined
        'no-undef-init': ERROR,

        // disallow the use of undefined as an identifier
        'no-undefined': OFF,

        // disallow the use of variables before they are defined
        'no-use-before-define': ERROR,

        /**
         * Node.js and CommonJS
         */

        // require return statements after callbacks
        'callback-return': OFF,

        // require require() calls to be placed at top-level module scope
        'global-require': OFF,

        // require error handling in callbacks
        'handle-callback-err': OFF,

        // disallow use of the Buffer() constructor
        'no-buffer-constructor': ERROR,

        // disallow require calls to be mixed with regular variable declarations
        'no-mixed-requires': ERROR,

        // disallow new operators with calls to require
        'no-new-require': ERROR,

        // disallow string concatenation with __dirname and __filename
        'no-path-concat': ERROR,

        // disallow the use of process.env
        'no-process-env': OFF,

        // disallow the use of process.exit()
        'no-process-exit': OFF,

        // disallow synchronous methods
        'no-sync': OFF,

        // disallow import declarations which import non-existence modules
        // 'node/no-missing-import': [ ERROR, {
        //     tryExtensions: [ '.js', '.json', '.ts', '.tsx' ]
        // } ],

        // disallow require() expressions which import non-existence modules
        // 'node/no-missing-require': [ ERROR, {
        //     tryExtensions: [ '.js', '.json', '.ts', '.tsx' ]
        // } ],

        // 'node/no-restricted-require': [ ERROR, RESTRICTED_PATTERNS_AND_MODULES ],

        /**
         * Stylistic Issues
         */

        // enforce linebreaks after opening and before closing array brackets
        'array-bracket-newline': [ WARN, 'consistent' ],

        // enforce line breaks after each array element
        'array-element-newline': OFF,

        // disallow or enforce spaces inside of blocks after opening block and before closing block
        'block-spacing': WARN,

        // enforce consistent brace style for blocks
        'brace-style': [ ERROR, '1tbs', { allowSingleLine: true } ],

        // enforce camelcase naming convention
        camelcase: [ ERROR, {
            properties: 'never',
            allow: [
                'UNSAFE_componentWillMount',
                'UNSAFE_componentWillReceiveProps',
                'UNSAFE_componentWillUpdate'
            ]
        } ],

        // enforce or disallow capitalization of the first letter of a comment
        'capitalized-comments': OFF,

        // require or disallow trailing commas
        'comma-dangle': [ ERROR, 'never' ],

        // enforce consistent spacing before and after commas
        'comma-spacing': [ ERROR, {
            before: false,
            after: true
        } ],

        // enforce consistent comma style
        'comma-style': [ ERROR, 'last' ],

        // enforce consistent spacing inside computed property brackets
        'computed-property-spacing': [ ERROR, 'never' ],

        // enforce consistent naming when capturing the current execution context
        'consistent-this': [ ERROR, '_this' ],

        // require or disallow newline at the end of files
        'eol-last': ERROR,

        // require or disallow spacing between function identifiers and their invocations
        'func-call-spacing': ERROR,

        // require function names to match the name of the variable or property to which they are assigned
        'func-name-matching': OFF,

        // require or disallow named function expressions
        'func-names': OFF,

        // enforce the consistent use of either function declarations or expressions
        'func-style': OFF,

        // enforce consistent line breaks inside function parentheses
        'function-paren-newline': OFF,

        // disallow specified identifiers
        'id-blacklist': OFF,

        // enforce minimum and maximum identifier lengths
        'id-length': OFF,

        // require identifiers to match a specified regular expression
        'id-match': [ ERROR, '^[\\w$]+$' ],

        // enforce the location of arrow function bodies
        'implicit-arrow-linebreak': OFF,

        // enforce consistent indentation
        indent: [ ERROR, 4, { SwitchCase: 1 } ],

        // enforce the consistent use of either double or single quotes in JSX attributes
        'jsx-quotes': OFF,

        // enforce consistent spacing between keys and values in object literal properties
        'key-spacing': [ ERROR, {
            beforeColon: false,
            afterColon: true
        } ],

        // enforce consistent spacing before and after keywords
        'keyword-spacing': ERROR,

        // enforce position of line comments
        'line-comment-position': OFF,

        // enforce consistent linebreak style
        'linebreak-style': ERROR,

        // require empty lines around comments
        'lines-around-comment': OFF,

        // require or disallow an empty line between class members
        'lines-between-class-members': OFF,

        // enforce a maximum depth that blocks can be nested
        'max-depth': [ ERROR, { max: 4 } ],

        // enforce a maximum line length
        'max-len': [ ERROR, 120, 4, {
            ignoreComments: true,
            ignoreUrls: true
        } ],

        // enforce a maximum number of lines per file
        'max-lines': OFF,

        // enforce a maximum number of line of code in a function
        'max-lines-per-function': OFF,

        // enforce a maximum depth that callbacks can be nested
        'max-nested-callbacks': ERROR,

        // enforce a maximum number of parameters in function definitions
        'max-params': OFF,

        // enforce a maximum number of statements allowed in function blocks
        'max-statements': OFF,

        // enforce a maximum number of statements allowed per line
        'max-statements-per-line': ERROR,

        // enforce a particular style for multiline comments
        'multiline-comment-style': OFF,

        // enforce newlines between operands of ternary expressions
        'multiline-ternary': OFF,

        // require constructor names to begin with a capital letter
        'new-cap': [ ERROR, { newIsCap: true } ],

        // require parentheses when invoking a constructor with no arguments
        'new-parens': ERROR,

        // require a newline after each call in a method chain
        'newline-per-chained-call': OFF,

        // disallow Array constructors
        'no-array-constructor': ERROR,

        // disallow bitwise operators
        'no-bitwise': OFF,

        // disallow continue statements
        'no-continue': ERROR,

        // disallow inline comments after code
        'no-inline-comments': OFF,

        // disallow if statements as the only statement in else blocks
        'no-lonely-if': OFF,

        // disallow mixed binary operators
        'no-mixed-operators': OFF,

        // disallow use of chained assignment expressions
        'no-multi-assign': OFF,

        // disallow multiple empty lines
        'no-multiple-empty-lines': [ ERROR, { max: 1 } ],

        // disallow negated conditions
        'no-negated-condition': OFF,

        // disallow nested ternary expressions
        'no-nested-ternary': ERROR,

        // disallow Object constructors
        'no-new-object': ERROR,

        // disallow the unary operators ++ and --
        'no-plusplus': OFF,

        // disallow all tabs
        'no-tabs': ERROR,

        // disallow ternary operators
        'no-ternary': OFF,

        // disallow trailing whitespace at the end of lines
        'no-trailing-spaces': ERROR,

        // disallow dangling underscores in identifiers
        'no-underscore-dangle': OFF,

        // disallow ternary operators when simpler alternatives exist
        'no-unneeded-ternary': [ ERROR, { defaultAssignment: false } ],

        // disallow whitespace before properties
        'no-whitespace-before-property': ERROR,

        // enforce the location of single-line statements
        'nonblock-statement-body-position': ERROR,

        // enforce consistent line breaks inside braces
        'object-curly-newline': OFF,

        // enforce consistent spacing inside braces
        'object-curly-spacing': [ ERROR, 'always' ],

        // enforce placing object properties on separate lines
        'object-property-newline': OFF,

        // enforce variables to be declared either together or separately in functions
        'one-var': [ ERROR, 'never' ],

        // require or disallow newlines around variable declarations
        'one-var-declaration-per-line': OFF,

        // require or disallow assignment operator shorthand where possible
        'operator-assignment': [ ERROR, 'always' ],

        // enforce consistent linebreak style for operators
        'operator-linebreak': [ ERROR, 'after' ],

        // require or disallow padding within blocks
        'padded-blocks': [
            ERROR,
            {
                blocks: 'never',
                classes: 'never',
                switches: 'never'
            },
            { allowSingleLineBlocks: true }
        ],

        // require or disallow padding lines between statements
        // TODO add return
        'padding-line-between-statements': [
            ERROR,
            { blankLine: 'always', prev: 'var', next: '*' },
            { blankLine: 'always', prev: 'let', next: '*' },
            { blankLine: 'always', prev: 'const', next: '*' },
            { blankLine: 'any', prev: 'var', next: 'var' },
            { blankLine: 'any', prev: 'let', next: 'let' },
            { blankLine: 'any', prev: 'let', next: 'const' },
            { blankLine: 'any', prev: 'const', next: 'const' },
            { blankLine: 'any', prev: 'const', next: 'let' }
        ],

        // disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead.
        'prefer-object-spread': OFF,

        // require quotes around object literal property names
        'quote-props': [ ERROR, 'as-needed', { keywords: false, unnecessary: true, numbers: false } ],

        // enforce the consistent use of either backticks, double, or single quotes
        quotes: [ ERROR, 'single', 'avoid-escape' ],

        // require or disallow semicolons instead of ASI
        semi: [ ERROR, 'always' ],

        // enforce consistent spacing before and after semicolons
        'semi-spacing': [ ERROR, {
            before: false,
            after: true
        } ],

        // enforce location of semicolons
        'semi-style': OFF,

        // require object keys to be sorted
        'sort-keys': OFF,

        // require variables within the same declaration block to be sorted
        'sort-vars': OFF,

        // enforce consistent spacing before blocks
        'space-before-blocks': ERROR,

        // enforce consistent spacing inside parentheses
        'space-in-parens': [ ERROR, 'never' ],

        // require spacing around infix operators
        'space-infix-ops': ERROR,

        // enforce consistent spacing after the // or /* in a comment
        'spaced-comment': [ ERROR, 'always' ],

        // enforce spacing around colons of switch statements
        'switch-colon-spacing': WARN,

        // require or disallow spacing between template tags and their literals
        'template-tag-spacing': ERROR,

        // require or disallow Unicode byte order mark (BOM)
        'unicode-bom': ERROR,

        // require parenthesis around regex literals
        'wrap-regex': OFF,

        /**
         * ECMAScript 6
         */

        // require braces around arrow function bodies
        'arrow-body-style': OFF,

        // require parentheses around arrow function arguments
        'arrow-parens': [ ERROR, 'as-needed' ],

        // enforce consistent spacing before and after the arrow in arrow functions
        'arrow-spacing': ERROR,

        // enforce consistent spacing around * operators in generator functions
        'generator-star-spacing': [ ERROR, {
            before: true,
            after: false
        } ],

        // disallow arrow functions where they could be confused with comparisons
        'no-confusing-arrow': OFF,

        // disallow duplicate module imports
        'no-duplicate-imports': OFF,

        // disallow unnecessary computed property keys in object literals
        'no-useless-computed-key': OFF,

        // disallow unnecessary constructors
        'no-useless-constructor': OFF,

        // disallow renaming import, export, and destructured assignments to the same name
        'no-useless-rename': ERROR,

        // require let or const instead of var
        'no-var': ERROR,

        // require or disallow method and property shorthand syntax for object literals
        'object-shorthand': ERROR,

        // require using arrow functions for callbacks
        'prefer-arrow-callback': OFF,

        // require const declarations for variables that are never reassigned after declared
        'prefer-const': ERROR,

        // require destructuring from arrays and/or objects
        'prefer-destructuring': OFF,

        // disallow parseInt() and Number.parseInt() in favor of binary, octal, and hexadecimal literals
        'prefer-numeric-literals': ERROR,

        // require rest parameters instead of arguments
        'prefer-rest-params': OFF,

        // require spread operators instead of .apply()
        'prefer-spread': ERROR,

        // require template literals instead of string concatenation
        'prefer-template': OFF,

        // enforce spacing between rest and spread operators and their expressions
        'rest-spread-spacing': ERROR,

        // enforce sorted import declarations within modules
        'sort-imports': OFF,

        // require symbol descriptions
        'symbol-description': ERROR,

        // require or disallow spacing around embedded expressions of template strings
        'template-curly-spacing': OFF,

        // require or disallow spacing around the * in yield* expressions
        'yield-star-spacing': ERROR,

        'id-length': [ ERROR, { 'exceptions': ['$', '_'], 'properties': 'never' }]
    },
};
