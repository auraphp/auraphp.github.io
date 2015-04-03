$(function ($) {
    var adjectives = [
        "powerful",
        "high-quality",
        "high-performance",
        "reliable",
        "modern",
        "advanced",
        "professional"
    ];
    var adjLower = adjectives[Math.floor(adjectives.length * Math.random())];
    var adjUpper = adjLower[0].toUpperCase() + adjLower.slice(1);
    $('<span />', {
        html: adjUpper + ' tools for ' + adjLower + ' applications.'
    }).appendTo('#adjectives');
});
