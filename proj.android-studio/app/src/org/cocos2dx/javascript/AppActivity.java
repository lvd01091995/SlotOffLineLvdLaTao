/****************************************************************************
Copyright (c) 2015 Chukong Technologies Inc.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.javascript.iap.InAppHelper;
import org.cocos2dx.lib.BuildConfig;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.DialogInterface;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.net.wifi.hotspot2.PasspointConfiguration;
import android.os.Build;
import android.os.Bundle;
import org.cocos2dx.javascript.SDKWrapper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.accountkit.Account;
import com.facebook.accountkit.AccountKit;
import com.facebook.accountkit.AccountKitCallback;
import com.facebook.accountkit.AccountKitError;
import com.facebook.accountkit.AccountKitLoginResult;
import com.facebook.accountkit.ui.AccountKitActivity;
import com.facebook.accountkit.ui.AccountKitConfiguration;
import com.facebook.accountkit.ui.LoginType;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.Sharer;
import com.facebook.share.model.ShareHashtag;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.model.SharePhoto;
import com.facebook.share.model.SharePhotoContent;
import com.facebook.share.widget.ShareDialog;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.iid.InstanceID;
import com.onesignal.OSNotificationAction;
import com.onesignal.OSNotificationOpenResult;
import com.onesignal.OneSignal;

import java.io.File;
import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import khmer.ngw.card.slot.R;

public class AppActivity extends Cocos2dxActivity {
    private CallbackManager mCallbackManager;
    private static InAppHelper inAppHelper;
    private String one_playerid;
    private String one_tokenid;
    private static String android_AdId;
    private String deviceId;


    //--------->>>>>>>> all onesignal <<<<<-----------------------
    private String userName;

    class ExampleNotificationOpenedHandler implements OneSignal.NotificationOpenedHandler {
        @Override
        public void notificationOpened(OSNotificationOpenResult result) {
            try {
                OSNotificationAction.ActionType actionType = result.action.type;
                JSONObject data = result.notification.payload.additionalData;

                Log.v("====>OpenOnesignal", "OpenOnesignal === " + String.valueOf(data));
//                JSONArray jsonArr = data.getJSONArray("params");
//                if (data != null) {
//                    if(!data.optString("giftcode").isEmpty()){
//                        save_ins.androidCallC(117, data.optString("giftcode"));
//                        Log.v("=====>OpenOneSignal", "giftcode: " + data.optString("giftcode"));
//                    }else if(!data.optString("freechip").isEmpty()){
//                        save_ins.androidCallC(118, data.optString("freechip"));
//                        Log.v("=====>OpenOneSignal", "freechip: " + data.optString("freechip"));
//                    }
//                }
                if (actionType == OSNotificationAction.ActionType.ActionTaken)
                    Log.v("OneSignalExample", "Button pressed with id: " + result.action.actionID);
            }catch (Exception e){
                Log.v("Exception", "===>Error notificationOpened");
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        this.setKeepScreenOn(true);
        mCallbackManager = CallbackManager.Factory.create();
        LoginManager.getInstance().registerCallback(mCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResult) {
                        save_ins.sendToJavascript(LOGIN_FACEBOOK, loginResult.getAccessToken().getToken());
                        //guiw accesstoken sang js
                    }

                    @Override
                    public void onCancel() {
                        // App code
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        // App code
                    }
                });
        SDKWrapper.getInstance().init(this);
        save_ins = this;

        inAppHelper = new InAppHelper(save_ins);
        inAppHelper.onCreate();

        //*********************One Signal ********************************************************
        OneSignal.startInit(this)
                .inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification)
                .setNotificationOpenedHandler(new ExampleNotificationOpenedHandler())
                .autoPromptLocation(true)
                .disableGmsMissingPrompt(true)
                .unsubscribeWhenNotificationsAreDisabled(true)
                .init();

//        OSPermissionSubscriptionState varTemp = OneSignal.getPermissionSubscriptionState();
        Log.v(TAG, "************* ONESIGNAL  *********** " + OneSignal.VERSION);
        OneSignal.idsAvailable(new OneSignal.IdsAvailableHandler() {
            @Override
            public void idsAvailable(String userId, String registrationId) {
                try {
                    Log.v(TAG, "=======>idsAvailable Exception");
                    Log.v(TAG, "************* ONESIGNAL  ***********: " + registrationId);
                    Log.v(TAG, "************* ONESIGNAL  ***********: " + userId);
                    one_playerid = userId;
                    one_tokenid = registrationId;
                }catch (Exception e){
                    Log.v(TAG, "=======>idsAvailable Exception");
                    e.printStackTrace();
                }
            }
        });
        Log.v(TAG, "************* END ONESIGNAL  ***********");
        //*********************END One Signal ********************************************************

        save_ins.registerReceiver();
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView,this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

        save_ins.registerReceiver();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
        unregisterReceiver(networkChangeReceiver);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
        if(inAppHelper != null) {
            inAppHelper.onDestroy();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
        if (requestCode != FRAMEWORK_REQUEST_CODE) {
            mCallbackManager.onActivityResult(requestCode, resultCode, data);
            if (inAppHelper != null) {
                inAppHelper.onActivityResult(requestCode, resultCode, data);
            }
            return;
        }

        final String toastMessage;
        final AccountKitLoginResult loginResult = AccountKit.loginResultWithIntent(data);
        if (loginResult == null || loginResult.wasCancelled()) {
            toastMessage = "Login Cancelled";
        } else if (loginResult.getError() != null) {

        } else {
            final com.facebook.accountkit.AccessToken accessToken = loginResult.getAccessToken();
            final long tokenRefreshIntervalInSeconds =
                    loginResult.getTokenRefreshIntervalInSeconds();
            if (accessToken != null) {
                toastMessage = "Success:" + accessToken.getAccountId()
                        + tokenRefreshIntervalInSeconds;
//                startActivity(new Intent(this, TokenActivity.class));

                AccountKit.getCurrentAccount(new AccountKitCallback<Account>() {
                    @Override
                    public void onSuccess(final Account account) {
                        Log.i("<cocos> result userId: ", account.getId());
                        Log.i("<cocos> result number: ", account.getPhoneNumber() + "");

                        save_ins.sendToJavascript(VEYRY_PHONE, account.getPhoneNumber() + "");
                    }
                    @Override
                    public void onError(final AccountKitError error) {
                        Log.i("<cocos> err", error + "");
                        Log.i("<cocos> result: ", "error, not found");

                        save_ins.sendToJavascript(VEYRY_PHONE,  "error");
                    }
                });

            } else {
                toastMessage = "Unknown response type";
            }
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();

//        new Thread(new Runnable() {
//            public void run()
//            {
//                try
//                {
//                    Context ctx = AppActivity.this.getApplicationContext();
//                    AdvertisingIdClient.Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(ctx);
//                    android_AdId = adInfo.getId();
//                    Log.v("getAndroidGGAID", "result androidAdId try: " + android_AdId);
//                }
//                catch (Exception e)
//                {
//                    android_AdId = "";
//                    Log.v("getAndroidGGAID", "result androidAdId catch: " + e.toString());
//                }
//
//            }
//        }).start();
    }

    /**/
    private static final int FRAMEWORK_REQUEST_CODE = 1;
    private int nextPermissionsRequestCode = 4000;
    private final Map<Integer, OnCompleteListener> permissionsListeners = new HashMap<>();
    public static AppActivity save_ins;
    public String androidId = "";
    public static String TAG = "cocos2djs";

    private static final String GET_ANDROID_ID  = "1";
    private static final String GET_BUNDLE_ID  = "2";
    private static final String GET_VERSION_ID  = "3";
    private static final String LOGIN_FACEBOOK  = "4";
    private static final String GET_PATH_FOR_SCREENSHOT  = "5";
    private static final String VEYRY_PHONE  = "6";
    private static final String CHAT_ADMIN  = "7";
    private static final String DEVICE_VERSION  = "8";
    private static final String SHARE_FACEBOOK  = "9";
    private static final String LOG_EVENT_TRACKING = "10";
    private static final String BUYIAP  = "11";
    private static final String SHARE_CODE_MESSAGE  = "12";
    private static final String SEND_TAG_ONESIGNAL  = "13";
    private static final String OPEN_FANPAGE  = "14";
    private static final String OPEN_GROUP  = "15";
    private static final String CHECK_NETWORK  = "16";
    private static final String PUSH_NOTI_OFFLINE  = "17";

    public static void onCallFromJavascript(final String evt, final String params) throws JSONException {
        Log.v("JAVASCRIPT_2_ANDROID", "---onCallFromJavascript === EVT " + evt + " Data: " + params);

//        showAlertDialog("HELLO " + evt, params);
        switch (evt){
            case GET_ANDROID_ID:{
                save_ins.getAndroidId();
//                save_ins.sendToJavascript(GET_ANDROID_ID, getIID(save_ins));
                break;
            }
            case GET_BUNDLE_ID:{
                save_ins.getBundleId();
                break;
            }
            case GET_VERSION_ID:{
                save_ins.getVersionId();
                break;
            }
            case LOGIN_FACEBOOK:{
                save_ins.onLoginFacebook();
                break;
            }case VEYRY_PHONE:{
                save_ins.onVeryPhone();
                break;
            }case CHAT_ADMIN:{
                JSONObject jsonData = new JSONObject(params);

                Log.i("<cocos> page ID ", "page Id " + jsonData.getString("pageID"));
                Log.i("<cocos> page URL ", "page URL " + jsonData.getString("pageUrl"));
                save_ins.openMessageFacebook(jsonData.getString("pageID"),jsonData.getString("pageUrl"));
                break;
            }
            case DEVICE_VERSION:{
                save_ins.getDeviceVersion();
                break;
            }
            case GET_PATH_FOR_SCREENSHOT:{
                Log.i("duy", "pathhh");
                save_ins.getPahtForScreenShot();
                break;
            } case SHARE_FACEBOOK:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.shareFB(jsonData.getString("path"),jsonData.getString("hasTag"));
                break;
            }
            case LOG_EVENT_TRACKING:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.sendLogEvent(jsonData.getJSONArray("param"));
                break;
            }
            case SHARE_CODE_MESSAGE:{
                save_ins.shareCodeMessage(params);
                break;
            }
            case BUYIAP:{
                if(inAppHelper != null) {
                    inAppHelper.buyItem(params);
                }
                break;
            }
            case SEND_TAG_ONESIGNAL:{
                JSONObject jsonData = new JSONObject(params);
//                Log.v("Log Android", "====> jsonData: " + jsonData);

                String key = (String) jsonData.get("key");
                String value = (String) jsonData.get("value");
                Log.v("Log Android", "====> key: " + key + "  value: " + value);
                OneSignal.sendTag(key, value);
                break;
            }
            case OPEN_FANPAGE:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.openFanpage(jsonData.getString("pageID"),jsonData.getString("pageUrl"));
                break;
            }
            case OPEN_GROUP:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.openGroup(jsonData.getString("groupID"),jsonData.getString("groupUrl"));
                break;
            }

            case CHECK_NETWORK:{
                save_ins.checkNetwork();
                break;
            }
            case PUSH_NOTI_OFFLINE:{
                Log.i("Cocos Call Native:", "Push Noti OffLine: " + params);
                JSONObject jsonData = new JSONObject(params);
                String title = jsonData.getString("title");
                String content = jsonData.getString("content");
                String category = jsonData.getString("category");
                String identifier = jsonData.getString("identifier");
                int time = Integer.parseInt(jsonData.getString("time"));
                save_ins.pushNotiOffline(title, content, category, identifier, time);
                break;
            }
        }
    }

    public static void sendToJavascript(final String evt, final String params){
        Log.i("duy", "params: " + params);

        save_ins.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                // Cocos2dxJavascriptJavaBridge.evalString("console.log('--------->>>>>>>>JavaCall evt: " + evt + "  params:  " + params + " ');");
                Cocos2dxJavascriptJavaBridge.evalString("cc.NativeCallJS(\"" + evt + "\",\"" + params + "\")");
            }
        });
    }

    public static void sendToJavascriptBitch(final String evt, final String params){
        Log.i("iaplogggg", "iaploggggparams: " + params);

        save_ins.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                // Cocos2dxJavascriptJavaBridge.evalString("console.log('--------->>>>>>>>JavaCall evt: " + evt + "  params:  " + params + " ');");
                Cocos2dxJavascriptJavaBridge.evalString("cc.NativeCallJS(\"" + evt + "\",\'" + params + "\')");
            }
        });
    }


//    private static void getAndroidGGAID(final Context ctx) {
//        new Thread(new Runnable() {
//            public void run()
//            {
//                try
//                {
//                    AdvertisingIdClient.Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(ctx);
//                    android_AdId = adInfo.getId();
//                    Log.v("getAndroidGGAID", "result androidAdId try: " + android_AdId);
//                }
//                catch (Exception e)
//                {
//                    android_AdId = "";
//                    Log.v("getAndroidGGAID", "result androidAdId catch: " + e.toString());
//                }
//
//            }
//        }).start();
//    }

    public static String getIID(final Context context) {
//        getAndroidGGAID(context);

        String android_ins_Id = "";
        try {

            android_ins_Id = InstanceID.getInstance(context).getId();
        } catch (Exception ex) {
            android_ins_Id = "";
        }

        if (!TextUtils.isEmpty(android_AdId)) {
            Log.v("getAndroidGGAID", "result android_AdId : " + android_AdId);
            save_ins.deviceId = android_AdId;
            return android_AdId;
        } else if (!TextUtils.isEmpty(android_ins_Id)) {
            Log.v("getAndroidGGAID", "result android_ins_Id : " + android_ins_Id);
            save_ins.deviceId = android_ins_Id;
            return android_ins_Id;
        } else {
            save_ins.deviceId = "";
            return "";
        }
    }

    public static String getAndroidId() {
        String myDeviceId = "cannot_get_deviceid";
        save_ins.androidId = myDeviceId;
        // get android id
        try {
            String android_id = Settings.Secure.getString(save_ins.getContext().getContentResolver(),
                    Settings.Secure.ANDROID_ID);

            Log.v(TAG, "************* ANDROID ID ***********" + android_id);
            myDeviceId = android_id;
            save_ins.androidId = myDeviceId;
            save_ins.sendToJavascript(GET_ANDROID_ID, save_ins.androidId);
        } catch (Exception e) {
            System.out.println("ERROR IN GET ANDROID ID: " + e.getMessage());
        }
        return myDeviceId;
    }
    public  String getBundleId() {
        String myBundleId = "cannot_get_bundleId";
        myBundleId =  getApplicationContext().getPackageName();
        save_ins.sendToJavascript(GET_BUNDLE_ID, myBundleId);
        return myBundleId;
    }
    public  void getVersionId() {
        String packageName = save_ins.getPackageName();
        PackageInfo pInfo;
        String version;
        try {
            pInfo = save_ins.getPackageManager().getPackageInfo(packageName, 0);
            version = pInfo.versionName;
            System.out.println("Version : " + version);
            save_ins.sendToJavascript(GET_VERSION_ID, version);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
//        String VersionId = "cannot_get_VersionId";
//        VersionId=  BuildConfig.VERSION_NAME;
//        save_ins.sendToJavascript(GET_VERSION_ID, VersionId);
//        return VersionId;
    }
    public  String getDeviceVersion() {
        String DeviceVersion = "cannot_get_VersionId";
        DeviceVersion = Build.VERSION.RELEASE;
        save_ins.sendToJavascript(DEVICE_VERSION, DeviceVersion);
        return DeviceVersion;
    }

    public void onLoginFacebook(){
        AccessToken accessToken = AccessToken.getCurrentAccessToken();
        boolean isLoggedIn = accessToken != null && !accessToken.isExpired();
        if(isLoggedIn){
            //gui sang javascript

            save_ins.sendToJavascript(LOGIN_FACEBOOK, accessToken.getToken());
        }else{
            LoginManager.getInstance().logInWithReadPermissions(this, Arrays.asList("public_profile"));
        }
    }


    public boolean appInstalledOrNot(String uri) {
        PackageManager pm = getPackageManager();
        try {
            pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    public void onVeryPhone() {
        if (AccountKit.getCurrentAccessToken() != null) { // AcountKit
            Log.i("<cocos> check ", "return " + AccountKit.getCurrentAccessToken());

            AccountKit.getCurrentAccount(new AccountKitCallback<Account>() {
                @Override
                public void onSuccess(final Account account) {
                    Log.i("<cocos> return userId: ", account.getId());
                    Log.i("<cocos> return number: ", account.getPhoneNumber() + "");
                }

                @Override
                public void onError(final AccountKitError error) {
                    Log.i("<cocos> return: ", "error, not found");
                }
            });

            AccountKit.logOut();
        } else
            save_ins.onCallFunVerify(LoginType.PHONE);
    }
    public void openMessageFacebook(String pageID, String pageURL) {
        try {
            boolean isExistFacebookApp = save_ins.appInstalledOrNot("com.facebook.orca");
            if (isExistFacebookApp) {
                String ppp = "fb-messenger://user-thread/" + pageID;
                Log.d("dcm", "0000debug mo app fb  " + ppp);
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(ppp));
                save_ins.startActivity(intent);
            } else {
                Log.d("dcm", "1111debug mo brrrr fb");
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(
                        "https://play.google.com/store/apps/details?id=com.facebook.orca"));
                intent.setPackage("com.android.vending");
                save_ins.startActivity(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private interface OnCompleteListener {
        void onComplete();
    }
    public void onCallFunVerify(final LoginType loginType) {
        final Intent intent = new Intent(this, AccountKitActivity.class);
        final AccountKitConfiguration.AccountKitConfigurationBuilder configurationBuilder
                = new AccountKitConfiguration.AccountKitConfigurationBuilder(
                loginType,
                AccountKitActivity.ResponseType.TOKEN);
        //By default enableInitialSmsButton=true which displays sms as login option alongwith whatsapp
        configurationBuilder.setEnableInitialSmsButton(true);
        final AccountKitConfiguration configuration = configurationBuilder.build();
        intent.putExtra(
                AccountKitActivity.ACCOUNT_KIT_ACTIVITY_CONFIGURATION,
                configuration);
        OnCompleteListener completeListener = new OnCompleteListener() {
            @Override
            public void onComplete() {
                startActivityForResult(intent, FRAMEWORK_REQUEST_CODE);
            }
        };
        switch (loginType) {
            case EMAIL:

                break;
            case PHONE:
                if (configuration.isReadPhoneStateEnabled() && !isGooglePlayServicesAvailable()) {
                    final OnCompleteListener readPhoneStateCompleteListener = completeListener;
                    completeListener = new OnCompleteListener() {
                        @Override
                        public void onComplete() {
                            requestPermissions(
                                    Manifest.permission.READ_PHONE_STATE,
                                    R.string.permissions_read_phone_state_title,
                                    R.string.permissions_read_phone_state_message,
                                    readPhoneStateCompleteListener);
                        }
                    };
                }
                break;
        }
        completeListener.onComplete();
    }
    private boolean canReadSmsWithoutPermission() {
        final GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        int googlePlayServicesAvailable = apiAvailability.isGooglePlayServicesAvailable(this);
        if (googlePlayServicesAvailable == ConnectionResult.SUCCESS) {
            return true;
        }
        //TODO we should also check for Android O here t18761104

        return false;
    }
    private boolean isGooglePlayServicesAvailable() {
        final GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        int googlePlayServicesAvailable = apiAvailability.isGooglePlayServicesAvailable(this);
        return googlePlayServicesAvailable == ConnectionResult.SUCCESS;
    }
    private void requestPermissions(final String permission, final int rationaleTitleResourceId, final int rationaleMessageResourceId, final AppActivity.OnCompleteListener listener) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            if (listener != null) {
                listener.onComplete();
            }
            return;
        }

        checkRequestPermissions(
                permission,
                rationaleTitleResourceId,
                rationaleMessageResourceId,
                listener);
    }
    @TargetApi(23)
    private void checkRequestPermissions(final String permission, final int rationaleTitleResourceId, final int rationaleMessageResourceId, final AppActivity.OnCompleteListener listener) {
        if (checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED) {
            if (listener != null) {
                listener.onComplete();
            }
            return;
        }

        final int requestCode = nextPermissionsRequestCode++;
        permissionsListeners.put(requestCode, listener);

        if (shouldShowRequestPermissionRationale(permission)) {
            new AlertDialog.Builder(this)
                    .setTitle(rationaleTitleResourceId)
                    .setMessage(rationaleMessageResourceId)
                    .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(final DialogInterface dialog, final int which) {
                            requestPermissions(new String[]{permission}, requestCode);
                        }
                    })
                    .setNegativeButton(android.R.string.no, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(final DialogInterface dialog, final int which) {
                            // ignore and clean up the listener
                            permissionsListeners.remove(requestCode);
                        }
                    })
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .show();
        } else {
            requestPermissions(new String[]{permission}, requestCode);
        }
    }
    public void getPahtForScreenShot(){
        Log.i("duy", "getPahtForScreenShot");

        String currenttime = "";
        Calendar calander = Calendar.getInstance();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
        currenttime = simpleDateFormat.format(calander.getTime());

        String path= getExternalFilesDir(null).getAbsolutePath() + File.separator+currenttime+".png"; //success!!
        Log.v("android show", "path get ="+path);
        save_ins.sendToJavascript(GET_PATH_FOR_SCREENSHOT, path);

    }

    public  void shareFB(String imgPath, String hasTag) {
        String shareHasTag= hasTag;
        boolean isFbAppInstalled = save_ins.appInstalledOrNot("com.facebook.katana");
        if (!isFbAppInstalled) {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(
                    "https://play.google.com/store/apps/details?id=com.facebook.katana"));
            intent.setPackage("com.android.vending");
            save_ins.startActivity(intent);
        } else {
            File file = new File(imgPath);
            if (file.exists()) {
                Log.v("android show", "path dmmmm file exists");
            }
            if (!file.exists()) {
                Log.v("android show", "path dmmmm file not exists! Need to create file!");
            }
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;
            Bitmap bMap = BitmapFactory.decodeFile(imgPath, options);
            ShareDialog shareDialog = new ShareDialog(save_ins);
            Log.v("android show", "path call share screenshot: can share 2" + imgPath);
            shareDialog.registerCallback(mCallbackManager, new FacebookCallback<Sharer.Result>() {
                @Override
                public void onSuccess(Sharer.Result result) {
                    Log.v("android show", "call share screenshot: share success");
                    save_ins.sendToJavascript(SHARE_FACEBOOK,"1");
                }

                @Override
                public void onCancel() {
                    Log.v("android show", "call share screenshot: cancel");
                    save_ins.sendToJavascript(SHARE_FACEBOOK, "0");
                }

                @Override
                public void onError(FacebookException e) {
                    Log.v("android show", "call share screenshot: share error: " + e.getMessage());
                   save_ins.sendToJavascript(SHARE_FACEBOOK, "0");
                }
            });
            if (ShareDialog.canShow(ShareLinkContent.class)) {
                Log.v("android show", "path call share screenshot: can share 3");
                SharePhoto photo = new SharePhoto.Builder()
                        .setBitmap(bMap).build();
                SharePhotoContent content = new SharePhotoContent.Builder()
                        .addPhoto(photo)
                        .setShareHashtag(new ShareHashtag.Builder()
                                .setHashtag(shareHasTag)
                                .build())
                        .build();

                shareDialog.show(content);
            }

        }
    }
    public  void shareCodeMessage(String code) {
        Intent smsIntent = new Intent(Intent.ACTION_VIEW);
        smsIntent.setType("vnd.android-dir/mms-sms");
        smsIntent.putExtra("sms_body", code);
        startActivity(smsIntent);
    }

    public static void sendLogEvent(final JSONArray jsonArr) {
        try {
            AppEventsLogger logger = AppEventsLogger.newLogger(save_ins);

            String event = jsonArr.getString(0);
            Bundle parameters = new Bundle();
            parameters.putString(event, event);
            Log.d("js", "----> " + event);

            int si = jsonArr.length();
            if (si >= 2) {
                String strTemp = "";
                strTemp = jsonArr.getString(si - 1);

                String[] strArray = strTemp.split(",");

                for (int i = 1; i < si - 1; i++) {
                    parameters.putString(strArray[i - 1], jsonArr.getString(i));
                }
            }
            logger.logEvent(event, parameters);

//            save_ins.mFirebaseAnalytics.logEvent(event, parameters);
            Log.d("js", "===============Firebase" + parameters.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    public void openFanpage(String pageID, String pageURL) {
        try {
            boolean isExistFacebookApp = save_ins.appInstalledOrNot("com.facebook.katana");
            if (isExistFacebookApp) {
                Log.d("js", "0000debug mo app fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("fb://page/" + pageID));
                save_ins.startActivity(intent);
            } else {
                Log.d("js", "1111debug mo brrrr fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(pageURL));
                save_ins.startActivity(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void openGroup(String groupID, String groupURL) {
        try {
            boolean isExistFacebookApp = save_ins.appInstalledOrNot("com.facebook.katana");
            if (isExistFacebookApp) {
                Log.d("js", "0000debug mo app fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("fb://group/" + groupID));
                save_ins.startActivity(intent);
            } else {
                Log.d("js", "1111debug mo brrrr fb");
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(groupURL));
                save_ins.startActivity(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private BroadcastReceiver networkChangeReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d("app","Network connectivity change");
            save_ins.checkNetwork();
        }
    };

    public void registerReceiver(){
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
        registerReceiver(networkChangeReceiver, intentFilter);
    }

    public void checkNetwork(){
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo Info = cm.getActiveNetworkInfo();

        if (Info == null || !Info.isConnectedOrConnecting()) {
            Log.i(TAG, "No connection");
            showToast("Not Connection. Please check Setting connection again!");

            save_ins.sendToJavascript(CHECK_NETWORK, "-1");
        } else {
            int netType = Info.getType();
//            int netSubtype = Info.getSubtype();

            if (netType == ConnectivityManager.TYPE_WIFI) {
                Log.i(TAG, "Wifi connection");
                WifiManager wifiManager = (WifiManager) save_ins.getApplicationContext().getSystemService(Context.WIFI_SERVICE);

                int rssi = wifiManager.getConnectionInfo().getRssi();
                int level = WifiManager.calculateSignalLevel(rssi, 5);
                Log.i(TAG,"-->Wifi connection Level is " + level + " out of 5");
                if(level < 3){
                    showToast("Mạng cùi bắp nên nghỉ chơi đi!");
                    save_ins.sendToJavascript(CHECK_NETWORK, "0");
                    return;
                }
            } else if (netType == ConnectivityManager.TYPE_MOBILE) {
                Log.i(TAG, "GPRS/3G connection");
            }

            if(isInternetAvailable()){
                Log.i(TAG, "Has internet");
            }else{
                Log.i(TAG, "Not internet");
                showToast("No internet connection, please check 3G/wifi connection again!");
                save_ins.sendToJavascript(CHECK_NETWORK, "-1");
            }
        }
    }
    boolean isInternetAvailable() {
        try {
            String command = "ping -c 1 google.com";
            return (Runtime.getRuntime().exec(command).waitFor() == 0);
        } catch (Exception e) {
            return false;
        }
    }

    void showToast(final String msg){
        save_ins.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(save_ins.getApplicationContext(), msg, Toast.LENGTH_LONG).show();
            }
        });
    }
    public void pushNotiOffline(String title, String content, String category, String identifier, int time) {
        try {
            Log.v(TAG, "0000==============> " + title + " MSG   " + content + " TIME " + String.valueOf(time));
            if (content.isEmpty() || content == "") return;
            Log.v(TAG, "0000==============> " );
            NotificationHelper.scheduleRepeatingRTCNotification(save_ins, title, content, category, identifier, time);
            NotificationHelper.enableBootReceiver(save_ins);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
