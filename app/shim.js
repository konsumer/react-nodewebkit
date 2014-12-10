/**
 * Browser-dev shim
 * shim all native modules here
 */

(function(){
  function shim(name){
    // put shims for native-requires in here, for browser testing
  }

  window.nativeRequire = (typeof require !== 'undefined') ? require : shim;
})();

