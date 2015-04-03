$(function ($) {
    var adjectives = [
        "powerful",
        "independent",
        "sharp",
        "high-quality",
        "reliable",
        "serious",
        "expert-level",
        "modern",
        "advanced",
        "professional"
    ];
    var adjLower = adjectives[Math.floor(adjectives.length * Math.random())];
    var adjUpper = adjLower[0].toUpperCase() + adjLower.slice(1);
    $('<span />', {
        html: adjUpper + ' tools for ' + adjLower + ' developers.'
    }).appendTo('#adjectives');
});
