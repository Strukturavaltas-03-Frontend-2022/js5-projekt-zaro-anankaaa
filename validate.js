const Validator = {
    patterns: {
        name: /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/,
        email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        address:/\d+\w+\s\w+\s\w+/,
    }
};
