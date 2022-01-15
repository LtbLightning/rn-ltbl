#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

//MARK: LND functions
@interface RCT_EXTERN_MODULE(RnMylnd, NSObject)

RCT_EXTERN_METHOD(
                  walletExists: (NSString *)network
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  currentState: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  start: (NSString *)configContent
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  genSeed: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  createWallet: (NSString *)password
                  seed: (NSArray *)seed
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  unlock: (NSString *)password
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  sendCommand: (NSString *)method
                  body: (NSString *)seed
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  sendStreamCommand: (NSString *)method
                  streamId: (NSString *)streamId
                  body: (NSString *)body
                  )
@end

//MARK: Events
@interface RCT_EXTERN_MODULE(LightningEventEmitter, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

@end
