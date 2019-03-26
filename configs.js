module.exports = [
    {
        key: "sound",
        type: "range",
        min: -2,
        max: 2
    },
    {
        key: "tempo",
        type: "range",
        min: -2,
        max: 2
    },
    {
        key: "solo",
        type: "button",
        options: [
            { label: "Solo 1", value: 1 },
            { label: "Solo 2", value: 2 },
            { label: "Solo 3", value: 3 },
            { label: "Solo 4", value: 4 }
        ]
    }
]
