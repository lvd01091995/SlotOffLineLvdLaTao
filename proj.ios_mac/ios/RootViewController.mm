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

#import "RootViewController.h"
#import "cocos2d.h"
#import "platform/ios/CCEAGLView-ios.h"
#import <WebKit/WebKit.h>
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#import <WebKit/WKNavigationDelegate.h>

@interface RootViewController ()
@end

@implementation RootViewController {
}

/*
// The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
// Custom initialization
}
return self;
}
*/

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Initialize the CCEAGLView
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [UIScreen mainScreen].bounds
                                         pixelFormat: (__bridge NSString *)cocos2d::GLViewImpl::_pixelFormat
                                         depthFormat: cocos2d::GLViewImpl::_depthFormat
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: NO
                                     numberOfSamples: 0 ];

    // Enable or disable multiple touches
    [eaglView setMultipleTouchEnabled:NO];

    // Set EAGLView as view of RootViewController
    self.view = eaglView;
    
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
    
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
    
    [[GADMobileAds sharedInstance] startWithCompletionHandler:nil];
    self.rewardedAd = [[GADRewardedAd alloc]
         initWithAdUnitID:@"ca-app-pub-3952383982385456/8249933379"];
    
   self.rewardedAd = [self createAndLoadRewardedAd];
    
//    NSArray *lll;
//    [self getProductInfo:lll];
//    self.productID = @"";
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}


// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];

    auto glview = cocos2d::Director::getInstance()->getOpenGLView();

    if (glview)
    {
        CCEAGLView *eaglview = (__bridge CCEAGLView *)glview->getEAGLView();

        if (eaglview)
        {
            CGSize s = CGSizeMake([eaglview getWidth], [eaglview getHeight]);
            cocos2d::Application::getInstance()->applicationScreenSizeChanged((int) s.width, (int) s.height);
        }
    }
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

- (void)buyProduct:(NSString *)_productID{
    self.productID = _productID;
    NSLog(@"------>   DMM   %@", self.productID);
    for(int i = 0; i < self.products.count; i++){
        SKProduct *skPro = [self.products objectAtIndex:i];
        if([skPro.productIdentifier isEqualToString:_productID]){

            NSLog(@"------>   DMM   %@ -- %@", self.productID, skPro.price);
            SKPayment *payment = [SKPayment paymentWithProduct:skPro];
            [[SKPaymentQueue defaultQueue] addPayment:payment];
            return;
        }
    }
    if(self.products.count < 0){
        [self getProductInfo: self._productIdentifiers];
    }else{
        //thong bao loi
    }
}
- (void)getProductInfo:(NSArray *)productIdentifiers{
      self._productIdentifiers = productIdentifiers;
    if ([SKPaymentQueue canMakePayments]){
        
//        SKProductsRequest *request = [[SKProductsRequest alloc]
//                                      initWithProductIdentifiers:
//                                      [NSSet setWithArray:@[@"com.naga.slots.1.pack",
//                                                            @"com.naga.slots.2.pack",
//                                                            @"com.naga.slots.5.pack",
//                                                            @"com.naga.slots.20.pack",
//                                                            @"com.naga.slots.50.pack",
//                                                            @"com.naga.slots.100.pack"
//                                      ]]];
         SKProductsRequest *request = [[SKProductsRequest alloc]
                                              initWithProductIdentifiers:
                                              [NSSet setWithArray:productIdentifiers]];
        request.delegate = self;
        [request start];
    }
    else{
        NSLog(@"Please enable In App Purchase in Settings");
    }
}

#pragma mark -
#pragma mark SKProductsRequestDelegate

-(void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    self.products = response.products;
    NSLog(@"------>   DMM invalidIdentifier  clmn %lu", self.products.count);
    //for (NSString *invalidIdentifier in response.invalidProductIdentifiers) {
    for(int i = 0; i < self.products.count; i++){
        // Handle any invalid product identifiers.
        SKProduct *skPro = [self.products objectAtIndex:i];
        NSString *invalidIdentifier = skPro.productIdentifier;
        NSLog(@"------>   DMM invalidIdentifier  %@ -- %@",invalidIdentifier, skPro.price);
        if([invalidIdentifier isEqualToString:self.productID]){
            [self buyProduct:invalidIdentifier];
        }
    }
    return;
}


-(void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
    self.productID = @"";
    for (SKPaymentTransaction *transaction in transactions)
    {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchased:{
                [[SKPaymentQueue defaultQueue]
                 finishTransaction:transaction];
                
                NSLog(@"Transaction Success!");
                NSLog(@"-->0  %@", transaction.transactionIdentifier);
                NSData *receiptData;
                if (NSFoundationVersionNumber >= NSFoundationVersionNumber_iOS_7_0) {
                    receiptData = [NSData dataWithContentsOfURL:[[NSBundle mainBundle] appStoreReceiptURL]];
                } else {
                    receiptData = transaction.transactionReceipt;
                }
                
                NSLog(@"-->1  %@", receiptData);
                NSLog(@"-->2  %@", transaction.transactionReceipt);
                NSLog(@"\n\n===== RECEIPT DATA: %@ =====\n\n", [receiptData base64EncodedStringWithOptions:0]);

                //                NSString* thu = [NSString stringWithFormat:@"\"%@\"", receiptData];
                NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"200", [receiptData base64EncodedStringWithOptions:0]];
                se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
                break;
            }
            case SKPaymentTransactionStateFailed:{
                NSLog(@"Transaction Failed");
                              NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"200",@"Failed"];
                              se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
                              [[SKPaymentQueue defaultQueue]
                               finishTransaction:transaction];
                              break;
            }
            default:
                break;
        }
    }
}

- (void) callVerifyPhoneNumber:(NSString*)type {
    
}

- (void)_presentWithSegueIdentifier:(NSString *)segueIdentifier animated:(BOOL)animated
{
    if (animated) {
        [self performSegueWithIdentifier:segueIdentifier sender:nil];
    } else {
        [UIView performWithoutAnimation:^{
            [self performSegueWithIdentifier:segueIdentifier sender:nil];
        }];
    }
}

-(void)shareScreenshotFacebook:(UIImage*)screenshot withHastag:(NSString*)hashTag{
    //    NSLog(@"hashTag: %@", hashTag);
    FBSDKSharePhoto *photo = [[FBSDKSharePhoto alloc] init];
    photo.image = screenshot;
    photo.userGenerated = YES;
    
    FBSDKSharePhotoContent *content = [[FBSDKSharePhotoContent alloc] init];
    content.photos = @[photo];
    content.hashtag = [FBSDKHashtag hashtagWithString:hashTag];
//    content.hashtag = [FBSDKHashtag hashtagWithString:@"#NGW"];
    
    [FBSDKShareDialog showFromViewController:self
                                 withContent:content
                                    delegate:self];
}

- (void)removePendingLocalNotification
{
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center removeAllPendingNotificationRequests];
}

-(void) showNoti:(NSString*) title withMessage:(NSString*) message withCategory:(NSString*)categoryIdentifier withIdentifier:(NSString*)identifier withTimeSecond : (NSInteger) timeSeconds{
    //    NSLog(@"======> Show notification:  %@", message);
    UNMutableNotificationContent* content = [[UNMutableNotificationContent alloc] init];
    content.title = [NSString localizedUserNotificationStringForKey:title arguments:nil];
    content.body = [NSString localizedUserNotificationStringForKey:message
                                                         arguments:nil];
    content.categoryIdentifier = categoryIdentifier;
    content.sound = [UNNotificationSound defaultSound];
    
    // Deliver the notification in time seconds.
    UNTimeIntervalNotificationTrigger* trigger = [UNTimeIntervalNotificationTrigger
                                                  triggerWithTimeInterval:timeSeconds repeats:NO];
    UNNotificationRequest* request = [UNNotificationRequest requestWithIdentifier:identifier
                                                                          content:content trigger:trigger];
    
    // Schedule the notification.
    UNUserNotificationCenter* center = [UNUserNotificationCenter currentNotificationCenter];
    
    //    NSLog(@"======> Show notification:  %@", message);
    [center addNotificationRequest:request withCompletionHandler:^(NSError *_Nullable error){
        if (error != nil) {
            //            NSLog(@"%@", error.localizedDescription);
        }
    }];
}

- (void)sharer:(id<FBSDKSharing>)sharer didCompleteWithResults:(NSDictionary *)results {
    NSLog(@"=-=-=-===== didCompleteWithResults: %@", results);
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"9", @"1"];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

- (void)sharer:(id<FBSDKSharing>)sharer didFailWithError:(NSError *)error {
    NSLog(@"=-=-=-===== didFailWithError: %@", error);
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"9", @"0"];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

- (void)sharerDidCancel:(id<FBSDKSharing>)sharer {
    NSLog(@"=-=-=-===== sharerDidCancel");
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"9", @"0"];
    se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}

-(void)onCall:(NSString*) phoneNumber{
    NSString *callNumber = [@"tel://" stringByAppendingString:phoneNumber];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:callNumber]];
}
// reward start
-(void)requestAds{
      self.rewardedAd = [self createAndLoadRewardedAd];
}
-(void)loadVideoView{
    if (self.rewardedAd.isReady) {
      [self.rewardedAd presentFromRootViewController:self delegate:self];
    } else {
      NSLog(@"Ad wasn't ready");
    }
}

- (GADRewardedAd *)createAndLoadRewardedAd {
     NSLog(@"Start request Ads");
  GADRewardedAd *rewardedAd = [[GADRewardedAd alloc]
      initWithAdUnitID:@"ca-app-pub-3952383982385456/8249933379"];
  GADRequest *request = [GADRequest request];
  [rewardedAd loadRequest:request completionHandler:^(GADRequestError * _Nullable error) {
    if (error) {
       NSLog(@"Failed to load Video: %@",error);
        
    } else {
      // Ad successfully loaded.
        NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"28",@""];
        se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
        NSLog(@"Successful load Video");
        // da san sang chien dau///
    }
  }];
  return rewardedAd;
}
/// Tells the delegate that the user earned a reward.
- (void)rewardedAd:(GADRewardedAd *)rewardedAd userDidEarnReward:(GADAdReward *)reward {
  // TODO: Reward the user.
  NSLog(@"rewardedAd:userDidEarnReward:");
    NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"30",@"Success"];
          se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
    //chuyen sang cocos + tien
}

/// Tells the delegate that the rewarded ad was presented.
- (void)rewardedAdDidPresent:(GADRewardedAd *)rewardedAd {
  NSLog(@"rewardedAdDidPresent:");
}

/// Tells the delegate that the rewarded ad failed to present.
- (void)rewardedAd:(GADRewardedAd *)rewardedAd didFailToPresentWithError:(NSError *)error {
  NSLog(@"rewardedAd:didFailToPresentWithError");
    self.rewardedAd = [self createAndLoadRewardedAd];
}

/// Tells the delegate that the rewarded ad was dismissed.
- (void)rewardedAdDidDismiss:(GADRewardedAd *)rewardedAd {
  NSLog(@"rewardedAdDidDismiss:");
    self.rewardedAd = [self createAndLoadRewardedAd];
    NSLog(@"rewardedAd:userDidEarnReward:");
      NSString* execStr = [NSString stringWithFormat:@"cc.NativeCallJS(\"%@\",\"%@\")", @"30",@"Dismiss"];
            se::ScriptEngine::getInstance()->evalString([execStr UTF8String]);
}
- (IBAction)close:(id)sender {
    [self closeWebView ];
}
-(void)openWebView:(NSString*) url_we {
    NSURL *url = [NSURL URLWithString:url_we];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    _webView = [[WKWebView alloc] initWithFrame:CGRectZero];
    [_webView loadRequest:request];
    _webView.frame = CGRectMake(self.view.frame.origin.x, self.view.frame.origin.y + 40, self.view.frame.size.width, self.view.frame.size.height - 40);
    [self.view addSubview:_webView];
    _webView.tag = 69;
    _webView.scrollView.bouncesZoom=false;
    _webView.navigationDelegate = self;
    _webView.UIDelegate = self;
    
    UIButton *imgView = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [imgView setBackgroundImage:[UIImage imageNamed:@"bar"] forState:UIControlStateNormal];
    imgView.frame = CGRectMake(self.view.frame.origin.x, -40, self.view.frame.size.width, 40);
    [_webView addSubview:imgView];
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [button addTarget:self
               action:@selector(close:)
     forControlEvents:UIControlEventTouchDown];
    [button setBackgroundImage:[UIImage imageNamed:@"btn_close"] forState:UIControlStateNormal];
    button.frame = CGRectMake(self.view.frame.size.width -90, 1, 90, 40);
    [button addTarget:self action:@selector(close:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];
    button.tag = 69;
}
- (void) closeWebView {
    [[self.view viewWithTag:69] removeFromSuperview];
}
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation {
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    NSLog(@"didStartProvisionalNavigation: %@", navigation);
}

- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation {
    NSLog(@"didReceiveServerRedirectForProvisionalNavigation: %@", navigation);
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"didFailProvisionalNavigation: %@navigation, error: %@", navigation, error);
}

- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation {
    NSLog(@"didCommitNavigation: %@", navigation);
}

- (void)webView:(WKWebView *)webView didFinishLoadingNavigation:(WKNavigation *)navigation {
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
    NSLog(@"didFinishLoadingNavigation: %@", navigation);
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"didFailNavigation: %@, error %@", navigation, error);
}

- (void)_webViewWebProcessDidCrash:(WKWebView *)webView {
    NSLog(@"WebContent process crashed; reloading");
}

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures {

    if (!navigationAction.targetFrame.isMainFrame) {
        [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
        [self.webView loadRequest:navigationAction.request];
    }
    return nil;
}

- (void)webView:(WKWebView *)webView didFinishNavigation: (WKNavigation *)navigation{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
    NSLog(@"didFinish: %@; stillLoading:%@", [self.webView URL], (self.webView.loading?@"NO":@"YES"));
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler {
    NSLog(@"decidePolicyForNavigationResponse");
    decisionHandler(WKNavigationResponsePolicyAllow);
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {

    if (decisionHandler) {
        decisionHandler(WKNavigationActionPolicyAllow);
    }
}
//reward end
@end
