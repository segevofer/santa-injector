(function () {
    var rendered = undefined;

    function isEditor() {
        return window.location.origin.indexOf('editor.wix.com') !== -1;
    }

    function isWix() {
        return (typeof window.serviceTopology === 'object') && (typeof window.santaBase === 'string');
    }

    function loadEditorAPI() {
        if (!isEditor()) return;
        window.editorAPI = window.editorAPI ||
            _.get(window, 'rendered.props.children.props.editorAPI') ||
            _.get(window, 'testApi.editorAPI;');
    }

    function init() {
        loadAsync('react', 'React');
        loadAsync('reactDOM', 'ReactDOM');
        loadAsync('lodash', '_');
        loadAsync('experiment');
        loadAsync('core', 'core', ['constants']);
        loadAsync('util', 'util', ['translate']);
        loadAsync('utils', 'utils');

        /** Add other stuff here */
    }

    function loadAsync(srcName, targetName, innerStuff) {
        window.require([srcName], function (required) {

            window[targetName || srcName] = window[targetName || srcName] || required;

            if (typeof innerStuff === 'function') {
                innerStuff();
            } else if (Array.isArray(innerStuff)) {
                for (var i = 0; i < innerStuff.length; i++) {
                    var attr = innerStuff[i];
                    window[attr] = required[attr];
                }
            }
        });
    }

    function waitAndInit() {
        Object.defineProperty(window, 'rendered', {
            get: function () {
                return rendered;
            },
            set: function (newValue) {
                rendered = newValue;
                init();
                loadEditorAPI();
            }
        });
    }

    if (isWix()) {
        waitAndInit();
    }

})();