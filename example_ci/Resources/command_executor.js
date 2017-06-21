var AdjustTesting = require('ti.adjusttesting');
var Adjust = require('ti.adjust');
var AdjustConfig = require('adjust_config');
var AdjustEvent = require('adjust_event');

function CommandExecutor() {
    this.adjustCommandExecutor = new AdjustCommandExecutor();
};

CommandExecutor.prototype.executeCommand = function(className, methodName, params) {
    switch (className) {
        case "Adjust":
            this.adjustCommandExecutor.executeCommand(methodName, params);
            break;
    }
};

function AdjustCommandExecutor() {
    console.log("[*] Calling constructor AdjustCommandExecutor");
    this.basePath = null;
};

AdjustCommandExecutor.prototype.executeCommand = function(methodName, params) {
    console.log("[*] executeCommand method: " + methodName);
        switch (methodName) {
            case "factory"                        : this.factory(params); break;
            case "config"                         : this.config(params); break;
            case "start"                          : this.start(params); break;
            case "event"                          : this.event(params); break;
            case "trackEvent"                     : this.trackEvent(params); break;
            case "resume"                         : this.resume(params); break;
            case "pause"                          : this.pause(params); break;
            case "setEnabled"                     : this.setEnabled(params); break;
            case "setReferrer"                    : this.setReferrer(params); break;
            case "setOfflineMode"                 : this.setOfflineMode(params); break;
            case "sendFirstPackages"              : this.sendFirstPackages(params); break;
            case "addSessionCallbackParameter"    : this.addSessionCallbackParameter(params); break;
            case "addSessionPartnerParameter"     : this.addSessionPartnerParameter(params); break;
            case "removeSessionCallbackParameter" : this.removeSessionCallbackParameter(params); break;
            case "removeSessionPartnerParameter"  : this.removeSessionPartnerParameter(params); break;
            case "resetSessionCallbackParameters" : this.resetSessionCallbackParameters(params); break;
            case "resetSessionPartnerParameters"  : this.resetSessionPartnerParameters(params); break;
            case "setPushToken"                   : this.setPushToken(params); break;
            case "teardown"                       : this.teardown(params); break;
            case "openDeeplink"                   : this.openDeeplink(params); break;
            case "sendReferrer"                   : this.sendReferrer(params); break;
            case "testBegin"                      : this.testBegin(params); break;
            case "testEnd"                        : this.testEnd(params); break;
        }
};

AdjustCommandExecutor.prototype.factory = function(params) {
    if ('basePath' in params) {
        this.basePath = getFirstParameterValue(params, 'basePath');
    }

    if ('timerInterval' in params) {
        Adjust.setTimerInterval(parseFloat(getFirstParameterValue(params, 'timerInterval')));
    }

    if ('timerStart' in params) {
        Adjust.setTimerStart(parseFloat(getFirstParameterValue(params, 'timerStart')));
    }

    if ('sessionInterval' in params) {
        Adjust.setSessionInterval(parseFloat(getFirstParameterValue(params, 'sessionInterval')));
    }

    if ('subsessionInterval' in params) {
        Adjust.setSubsessionInterval(parseFloat(getFirstParameterValue(params, 'subsessionInterval')));
    }
};

AdjustCommandExecutor.prototype.teardown = function(params) {
    if ('devareState' in params) {
        var devareState = getFirstParameterValue(params, 'devareState') == 'true';
        Adjust.teardown(devareState);
    }
};

AdjustCommandExecutor.prototype.config = function(params) {
    var environment = getFirstParameterValue(params, 'environment');
    var appToken = getFirstParameterValue(params, 'appToken');

    var adjustConfig = new AdjustConfig(appToken, environment);

    if ('logLevel' in params) {
        var logLevelS = getFirstParameterValue(params, 'logLevel');
        var logLevel = null;

        switch (logLevelS) {
            case "verbose": logLevel = AdjustConfig.LogLevelVerbose;
                break;
            case "debug": logLevel = AdjustConfig.LogLevelDebug;
                break;
            case "info": logLevel = AdjustConfig.LogLevelInfo;
                break;
            case "warn": logLevel = AdjustConfig.LogLevelWarn;
                break;
            case "error": logLevel = AdjustConfig.LogLevelError;
                break;
            case "assert": logLevel = AdjustConfig.LogLevelAssert;
                break;
            case "suppress": logLevel = AdjustConfig.LogLevelSuppress;
                break;
        }

        adjustConfig.setLogLevel(logLevel);
    }

    if ('defaultTracker' in params) {
        var defaultTracker = getFirstParameterValue(params, 'defaultTracker');
        adjustConfig.setDefaultTracker(defaultTracker);
    }

    if ('delayStart' in params) {
        var delayStartS = getFirstParameterValue(params, 'delayStart');
        var delayStart = parseFloat(delayStartS);
        adjustConfig.setDelayStart(delayStart);
    }

    if ('eventBufferingEnabled' in params) {
        var eventBufferingEnabledS = getFirstParameterValue(params, 'eventBufferingEnabled');
        var eventBufferingEnabled = eventBufferingEnabledS == 'true';
        adjustConfig.setEventBufferingEnabled(eventBufferingEnabled);
    }

    if ('sendInBackground' in params) {
        var sendInBackgroundS = getFirstParameterValue(params, 'sendInBackground');
        var sendInBackground = sendInBackgroundS == 'true';
        adjustConfig.setSendInBackground(sendInBackground);
    }

    if ('userAgent' in params) {
        var userAgent = getFirstParameterValue(params, 'userAgent');
        adjustConfig.setUserAgent(userAgent);
    }

    if ('sdkPrefix' in params) {
        var sdkPrefix = getFirstParameterValue(params, 'sdkPrefix');
        adjustConfig.setSdkPrefix(sdkPrefix);
    }

    if ('attributionCallbackSendAll' in params) {
        adjustConfig.setAttributionCallbackListener(function(attribution) {
            AdjustTesting.addInfoToSend("trackerToken", attribution.trackerToken);
            AdjustTesting.addInfoToSend("trackerName", attribution.trackerName);
            AdjustTesting.addInfoToSend("network", attribution.network);
            AdjustTesting.addInfoToSend("campaign", attribution.campaign);
            AdjustTesting.addInfoToSend("adgroup", attribution.adgroup);
            AdjustTesting.addInfoToSend("creative", attribution.creative);
            AdjustTesting.addInfoToSend("clickLabel", attribution.clickLabel);
            AdjustTesting.addInfoToSend("adid", attribution.adid);

            AdjustTesting.sendInfoToServer();
        });
    }

    if ('sessionCallbackSendSuccess' in params) {
        adjustConfig.setSessionTrackingSuccessCallbackListener(function(sessionSuccess) {
            AdjustTesting.addInfoToSend("message", sessionSuccess.message);
            AdjustTesting.addInfoToSend("timestamp", sessionSuccess.timestamp);
            AdjustTesting.addInfoToSend("adid", sessionSuccess.adid);
            AdjustTesting.addInfoToSend("jsonResponse", sessionSuccess.jsonResponse);

            AdjustTesting.sendInfoToServer();
        });
    }

    if ('sessionCallbackSendFailure' in params) {
        adjustConfig.setSessionTrackingFailureCallbackListener(function(sessionFailed) {
            AdjustTesting.addInfoToSend("message", sessionFailed.message);
            AdjustTesting.addInfoToSend("timestamp", sessionFailed.timestamp);
            AdjustTesting.addInfoToSend("adid", sessionFailed.adid);
            AdjustTesting.addInfoToSend("willRetry", sessionFailed.willRetry);
            AdjustTesting.addInfoToSend("jsonResponse", sessionFailed.jsonResponse);

            AdjustTesting.sendInfoToServer();
        });
    }

    if ('eventCallbackSendSuccess' in params) {
        adjustConfig.setEventTrackingSuccessCallbackListener(function(eventSuccess) {
            AdjustTesting.addInfoToSend("message", eventSuccess.message);
            AdjustTesting.addInfoToSend("timestamp", eventSuccess.timestamp);
            AdjustTesting.addInfoToSend("adid", eventSuccess.adid);
            AdjustTesting.addInfoToSend("eventToken", eventSuccess.eventToken);
            AdjustTesting.addInfoToSend("jsonResponse", eventSuccess.jsonResponse);

            AdjustTesting.sendInfoToServer();
        });
    }

    if ('eventCallbackSendFailure' in params) {
        adjustConfig.setEventTrackingFailureCallbackListener(function(eventFailed) {
            AdjustTesting.addInfoToSend("message", eventFailed.message);
            AdjustTesting.addInfoToSend("timestamp", eventFailed.timestamp);
            AdjustTesting.addInfoToSend("adid", eventFailed.adid);
            AdjustTesting.addInfoToSend("eventToken", eventFailed.eventToken);
            AdjustTesting.addInfoToSend("willRetry", eventFailed.willRetry);
            AdjustTesting.addInfoToSend("jsonResponse", eventFailed.jsonResponse);

            AdjustTesting.sendInfoToServer();
        });
    }

    return adjustConfig;
};

AdjustCommandExecutor.prototype.start = function(params) {
    var adjustConfig = this.config(params);

    adjustConfig.setBasePath(this.basePath);

    Adjust.start(adjustConfig);
};

AdjustCommandExecutor.prototype.event = function(params) {
    var eventToken = getFirstParameterValue(params, 'eventToken');
    var adjustEvent = new AdjustEvent(eventToken);

    if ('revenue' in params) {
        var revenueParams = getValueFromKey(params, 'revenue');
        var currency = revenueParams[0];
        var revenue = parseFloat(revenueParams[1]);

        adjustEvent.setRevenue(revenue, currency);
    }

    if ('callbackParams' in params) {
        var callbackParams = getValueFromKey(params, "callbackParams");
        for (var i = 0; i < callbackParams.length; i = i + 2) {
            var key = callbackParams[i];
            var value = callbackParams[i + 1];

            adjustEvent.addCallbackParameter(key, value);
        }
    }

    if ('partnerParams' in params) {
        var partnerParams = getValueFromKey(params, "partnerParams");
        for (var i = 0; i < partnerParams.length; i = i + 2) {
            var key = partnerParams[i];
            var value = partnerParams[i + 1];

            adjustEvent.addPartnerParameter(key, value);
        }
    }

    if ('orderId' in params) {
        var orderId = getFirstParameterValue(params, 'orderId');
        adjustEvent.setTransactionId(orderId);
    }

    return adjustEvent;
};

AdjustCommandExecutor.prototype.trackEvent = function(params) {
    var adjustEvent = this.event(params);
    Adjust.trackEvent(adjustEvent);
};

AdjustCommandExecutor.prototype.setReferrer = function(params) {
    var referrer = getFirstParameterValue(params, 'referrer');
    Adjust.setReferrer(referrer);
};

AdjustCommandExecutor.prototype.pause = function(params) {
    Adjust.onPause();
};

AdjustCommandExecutor.prototype.resume = function(params) {
    Adjust.onResume();
};

AdjustCommandExecutor.prototype.setEnabled = function(params) {
    var enabled = getFirstParameterValue(params, "enabled") == 'true';
    Adjust.setEnabled(enabled);
};

AdjustCommandExecutor.prototype.setOfflineMode = function(params) {
    var enabled = getFirstParameterValue(params, "enabled") == 'true';
    Adjust.setOfflineMode(enabled);
};

AdjustCommandExecutor.prototype.sendFirstPackages = function(params) {
    Adjust.sendFirstPackages();
};

AdjustCommandExecutor.prototype.addSessionCallbackParameter = function(params) {
    var list = getValueFromKey(params, "KeyValue");
    for (var i = 0; i < list.length; i = i+2){
        var key = list[i];
        var value = list[i+1];

        Adjust.addSessionCallbackParameter(key, value);
    }
};

AdjustCommandExecutor.prototype.addSessionPartnerParameter = function(params) {
    var list = getValueFromKey(params, "KeyValue");
    for (var i = 0; i < list.length; i = i+2){
        var key = list[i];
        var value = list[i+1];

        Adjust.addSessionPartnerParameter(key, value);
    }
};

AdjustCommandExecutor.prototype.removeSessionCallbackParameter = function(params) {
    var list = getValueFromKey(params, 'key');

    for (var i = 0; i < list.length; i++) {
        Adjust.removeSessionCallbackParameter(list[i]);
    }
};

AdjustCommandExecutor.prototype.removeSessionPartnerParameter = function(params) {
    var list = getValueFromKey(params, 'key');

    for (var i = 0; i < list.length; i++) {
        Adjust.removeSessionPartnerParameter(list[i]);
    }
};

AdjustCommandExecutor.prototype.resetSessionCallbackParameters = function(params) {
    Adjust.resetSessionCallbackParameters();
};

AdjustCommandExecutor.prototype.resetSessionPartnerParameters = function(params) {
    Adjust.resetSessionPartnerParameters();
};

AdjustCommandExecutor.prototype.setPushToken = function(params) {
    var token = getFirstParameterValue(params, 'pushToken');
    Adjust.setPushToken(token);
};

AdjustCommandExecutor.prototype.openDeeplink = function(params) {
    var deeplink = getFirstParameterValue(params, "deeplink");
    Adjust.appWillOpenUrl(deeplink);
};

AdjustCommandExecutor.prototype.sendReferrer = function(params) {
    var referrer = getFirstParameterValue(params, 'referrer');
    Adjust.setReferrer(referrer);
};

AdjustCommandExecutor.prototype.testBegin = function(params) {
    if ('basePath' in params) {
        this.basePath = getFirstParameterValue(params, "basePath");
    }

    Adjust.teardown(true);
    Adjust.setTimerInterval(-1);
    Adjust.setTimerStart(-1);
    Adjust.setSessionInterval(-1);
    Adjust.setSubsessionInterval(-1);
};

AdjustCommandExecutor.prototype.testEnd = function(params) {
    Adjust.teardown(true);
};

//Util
//======================
function getValueFromKey(params, key) {
    if (key in params) {
        return params[key];
    }

    return null;
}

function getFirstParameterValue(params, key) {
    if (key in params) {
        var param = params[key];

        if(param != null || param.length >= 1) {
            return param[0];
        }
    }

    return null;
}

module.exports = CommandExecutor;
