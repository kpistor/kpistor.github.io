if (!window.console) {
    (function () {
        var names = ["log", "debug", "info", "warn", "error",
            "assert", "dir", "dirxml", "group", "groupEnd", "time",
            "timeEnd", "count", "trace", "profile", "profileEnd"],
            i, l = names.length;

        window.console = {};

        for (i = 0; i < l; i++) {
            window.console[names[i]] = function () { };
        }
    }());
}

jQuery.fn.serializeObject = function () {
    var arrayData, objectData;
    arrayData = this.serializeArray();
    objectData = {};

    $.each(arrayData, function () {
        var value;

        if (this.value != null) {
            value = this.value;
        } else {
            value = '';
        }

        if (objectData[this.name] != null) {
            if (!objectData[this.name].push) {
                objectData[this.name] = [objectData[this.name]];
            }

            objectData[this.name].push(value);
        } else {
            objectData[this.name] = value;
        }
    });

    return objectData;
};

var typewatch = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

function scrapeForm(selector, key_attr) {
    if (!key_attr)
        key_attr = "id";
    var values = {};
    jQuery(selector + " :input:not(:button,:file,:image,:radio)").each(function() {
        var $this = jQuery(this);
        var key = $this.attr(key_attr);
        if (key != undefined && key != '' ) {
            if ($this.is("input[type='checkbox']"))
                values[key] = $this.is(":checked");
            else
                values[key] = $this.val();
        }
    });
    
    jQuery(selector + " input:radio:checked").each(function() {
        var $this = jQuery(this);
        var key = $this.attr('id');
        if(key != undefined && key != '')
            values[key] = $this.val();

        //group radio
        var name = $this.attr('name');
        if(name != undefined && name != '' && $this.attr('id') != name) 
        {
            if(!(name in values))
                values[name] = new Array();
            values[name].push($this.val());
        }
    });

    //group checkbox
    jQuery(selector + " input:checkbox:checked").each(function() {
        var $this = jQuery(this);
        var key = $this.attr('name');
        if(!(key in values))
            values[key] = new Array();
        values[key].push($this.val());
    });
    
    //alert(JSON.stringify(values)); //DEBUG
    return values;
}

function clearFields(selector) {
    var container;
    if (selector instanceof jQuery)
        container = selector;
    else
        container = $(selector);
    container.find(':input').each(function () {
        var $this = $(this);
        switch (this.type) {
            case 'select-multiple':
            case 'select-one':
                $this.val( $this.find('option:first').val() );
                break;
            case 'hidden':
            case 'password':
            case 'text':
            case 'email':
            case 'textarea':
                $this.val('');
                break;
            case 'checkbox':
            case 'radio':
                $this.prop('checked', false);
        }
    });
}

function fillForm(selector, values, key_attr) {
    if (!key_attr)
        key_attr = "name";
    if (!$.isPlainObject(values))
        values = $.parseJSON(values);
    var coll = $(selector + ' :input').not(':button, :file, :image, :reset, :submit, :radio, :checkbox');
    coll.each(function () {
        var element = $(this);
        var key = element.attr(key_attr);
        if (key && values[key]) {
            var type = element.attr('data-type');
            if(type && type === 'datetime')
                element.val(moment(values[key]).format('M/D/YYYY h:mm:ss a'));
            else
                element.val(values[key]);
        }
    });

    coll = $(selector + ' :radio, :checkbox');
    coll.each(function () {
        var element = $(this);
        //radio/checkbox group
        var key = element.attr('name');
        if (key && values[key]) {
            if (element.val() == values[key])
                element.attr('checked', 'checked');
            else {
                if (values[key] === true || values[key].toUpperCase() == 'TRUE')
                    element.attr('checked', 'checked');
                else
                    element.removeAttr('checked');
            }
        } else {
            //radio/checkbox standalone
            key = element.attr('id');
            if (key && values[key]) {
                if (element.val() == values[key])
                    element.attr('checked', 'checked');
                else {
                    if (values[key] === true || values[key].toUpperCase() == 'TRUE')
                        element.attr('checked', 'checked');
                    else
                        element.removeAttr('checked');
                }
            }
        }
    });
}

function findBootstrapEnvironment() {
    var envs = ['phone', 'tablet', 'desktop'];

    $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = envs.length - 1; i >= 0; i--) {
        var env = envs[i];

        $el.addClass('hidden-'+env);
        if ($el.is(':hidden')) {
            $el.remove();
            return env
        }
    };
}

function getBrowserVersion() {
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[1];
}