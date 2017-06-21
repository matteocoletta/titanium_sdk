/**
 * Create a new `Ti.UI.TabGroup`.
 */
var tabGroup = Ti.UI.createTabGroup();

/**
 * Add the two created tabs to the tabGroup object.
 */
tabGroup.addTab(createTab("Tab 1", "I am Window 1", "assets/images/tab1.png"));
tabGroup.addTab(createTab("Tab 2", "I am Window 2", "assets/images/tab2.png"));

/**
 * Open the tabGroup
 */
tabGroup.open();

/**
 * Creates a new Tab and configures it.
 *
 * @param  {String} title The title used in the `Ti.UI.Tab` and it's included `Ti.UI.Window`
 * @param  {String} message The title displayed in the `Ti.UI.Label`
 * @return {String} icon The icon used in the `Ti.UI.Tab`
 */
function createTab(title, message, icon) {
    var win = Ti.UI.createWindow({
    	exitOnClose: true,
        title: title,
        backgroundColor: '#fff'
    });

    var label = Ti.UI.createLabel({
        text: message,
        color: "#333",
        font: {
            fontSize: 20
        }
    });

    win.add(label);

    var tab = Ti.UI.createTab({
        title: title,
        icon: icon,
        window: win
    });

    return tab;
}


// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
var CommandExecutor = require('command_executor');
var AdjustTesting = require('ti.adjusttesting');
var Adjust = require('ti.adjust');
var AdjustConfig = require('adjust_config');
var AdjustEvent = require('adjust_event');

(function() {
    var baseUrl = 'https://10.0.2.2:8443';
    Adjust.setTestingMode(baseUrl);


    var commandExecutor = new CommandExecutor();
    AdjustTesting.initTestSession(baseUrl, function(json) {
        var commandDict = JSON.parse(json);
        var className = commandDict['className'];
        var functionName = commandDict['functionName'];
        var params = commandDict['params'];

        console.log('>>>>>>>>>> className: ' + className);
        console.log('>>>>>>>>>> functionName: ' + functionName);
        console.log('>>>>>>>>>> params: ' + params);

        commandExecutor.executeCommand(className, functionName, params);
    });
    
    AdjustTesting.setOnExitListener(function() {
      var activity = Titanium.Android.currentActivity;
      activity.finish();
    });
})();


