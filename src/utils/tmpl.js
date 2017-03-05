var tmplVars = "print=function(s,e){_s+=e&&(s||'')||_e(s);},",
    tmplEncodeReg = /[<>&"'\x00]/g,
    tmplEncodeMap = {
        "<"   : "&lt;",
        ">"   : "&gt;",
        "&"   : "&amp;",
        "\""  : "&quot;",
        "'"   : "&#39;"
    };

function tmpl_replace(str){
    return str.replace(/([\s'\\])(?![^%]*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,function (s, p1, p2, p3, p4, p5) {
        if (p1) { // whitespace, quote and backspace in interpolation context
            return {
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t",
                " " : " "
            }[s] || "\\" + s;
        }
        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            if (p2 === "=") {
                return "'\r\n+_e(" + p3 + ")+'";
            }
            return "'\r\n+(" + p3 + ")+'";
        }
        if (p4) { // evaluation start tag: {%
            return "';\r\n";
        }
        if (p5) { // evaluation end tag: %}
            return "\r\n_s+='";
        }
    });
}

function tmpl_slash(s) {
    return String(s || '').replace(tmplEncodeReg,function (c) {
            return tmplEncodeMap[c] || "";
        }
    );
}

function tmpl(str, url) {
    /*jshint -W054 */
    var f = new Function('o,_e', 'var '+ tmplVars + "\r\n_s='';o||(o={}); with(o){_s='" +
        tmpl_replace(str || '') +
        "';}\r\nreturn _s;" +
        (url && tmpl.debug ? ('\r\n//# sourceURL='+url) : ''));
    /*jshint +W054 */
    return function (data) {
        return f(data, tmpl_slash);
    };
}

tmpl.inject = function(s){
    tmplVars += s;
};

module.exports.tmpl = tmpl;