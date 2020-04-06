/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#import <UIKit/UIKit.h>
#import <StoreKit/StoreKit.h>
#import <AVFoundation/AVFoundation.h>
#import <FBSDKShareKit/FBSDKShareKit.h>
#import <UserNotifications/UserNotifications.h>
#import <GoogleMobileAds/GoogleMobileAds.h>
#import <UIKit/UIKit.h>

@interface RootViewController : UIViewController <SKPaymentTransactionObserver, SKProductsRequestDelegate, FBSDKSharingDelegate, GADRewardedAdDelegate,WKNavigationDelegate, WKUIDelegate>{

}
@property(strong,nonatomic) WKWebView *webView;
- (BOOL)prefersStatusBarHidden;

//@property (strong, nonatomic) SKProduct *product;
@property (strong, nonatomic) NSString *productID;
@property (strong, nonatomic) NSArray<NSString *> *_productIdentifiers;
@property (strong, nonatomic) NSArray<SKProduct *> *products;
@property(nonatomic, strong) GADRewardedAd *rewardedAd;
-(void)buyProduct:(NSString*)_productID;
-(void)getProductInfo:(NSArray *)productIdentifiers;

-(void) callVerifyPhoneNumber:(NSString*)type;
-(void)shareScreenshotFacebook:(UIImage*)screenshot withHastag:(NSString*)hashTag;

-(void) showNoti:(NSString*) title withMessage:(NSString*) message withCategory:(NSString*)categoryIdentifier withIdentifier:(NSString*)identifier withTimeSecond:(NSInteger) timeSeconds;

-(void)onCall:(NSString*) phoneNumber;
- (GADRewardedAd *)createAndLoadRewardedAd;
-(void)loadVideoView;
-(void)requestAds;;
-(void)openSFFurl:(NSString*) url;
-(void)openWebView:(NSString*) url_we;
- (void) closeWebView;
@end
