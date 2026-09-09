package pl.swir.czateriaplus;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Locale;

public class MainActivity extends Activity {

    private static final String HOME_URL = "https://czateria.interia.pl/emb-chat";
    private static final String XBOOKMARK_REF = "8ef1a5773f98780094c65042c2e622852ea6eb29";
    private static final String XBOOKMARK_VERSION = "9.9 RECOMMENDED";
    private static final int FILE_CHOOSER_REQUEST = 2001;
    private static final int WEB_PERMISSION_REQUEST = 2002;
    private static final int GEO_PERMISSION_REQUEST = 2003;

    private WebView webView;
    private ProgressBar progress;
    private TextView badge;
    private ValueCallback<Uri[]> fileCallback;
    private PermissionRequest pendingWebPermission;
    private String pendingGeoOrigin;
    private GeolocationPermissions.Callback pendingGeoCallback;

    private final String xBookmarkLoader =
            "(function(){try{" +
            "if(window.__CZATERIA_PLUS_99_LOADER)return;" +
            "window.__CZATERIA_PLUS_99_LOADER=true;" +
            "var REF='" + XBOOKMARK_REF + "';" +
            "var CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+REF+'/swir.js';" +
            "var tries=0;" +
            "function boot(){tries++;" +
            "if(typeof CHNS==='undefined'){if(tries<120){setTimeout(boot,500);}else{window.__CZATERIA_PLUS_99_LOADER=false;}return;}" +
            "if(document.getElementById('czateria-plus-xbookmark-99'))return;" +
            "var s=document.createElement('script');" +
            "s.id='czateria-plus-xbookmark-99';" +
            "s.src=CDN+'?app=czateria-plus-9.9&ts='+Date.now();" +
            "s.onload=function(){console.log('CZATeria Plus: XBookmark 9.9 loaded @ '+REF);};" +
            "s.onerror=function(){console.error('CZATeria Plus: XBookmark 9.9 load error');window.__CZATERIA_PLUS_99_LOADER=false;};" +
            "(document.head||document.documentElement).appendChild(s);}" +
            "boot();" +
            "}catch(e){console.error('CZATeria Plus loader:',e);window.__CZATERIA_PLUS_99_LOADER=false;}})();";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        createUi();
        configureWebView();
        if (savedInstanceState != null) webView.restoreState(savedInstanceState);
        else webView.loadUrl(HOME_URL);
    }

    private void createUi() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(5, 7, 11));

        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        FrameLayout.LayoutParams pp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(3));
        pp.gravity = Gravity.TOP;
        root.addView(progress, pp);

        badge = new TextView(this);
        badge.setText("SWIR 9.9");
        badge.setTextColor(Color.WHITE);
        badge.setTextSize(10);
        badge.setGravity(Gravity.CENTER);
        badge.setBackgroundColor(Color.argb(190, 5, 20, 30));
        badge.setPadding(dp(8), dp(4), dp(8), dp(4));
        FrameLayout.LayoutParams bp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        bp.gravity = Gravity.TOP | Gravity.END;
        bp.topMargin = dp(7);
        bp.rightMargin = dp(7);
        root.addView(badge, bp);

        badge.setOnClickListener(v -> injectXBookmark());
        badge.setOnLongClickListener(v -> {
            new AlertDialog.Builder(this)
                    .setTitle("CZATeria Plus")
                    .setMessage("XBookmark: " + XBOOKMARK_VERSION +
                            "\nRef: " + XBOOKMARK_REF.substring(0, 12) +
                            "\n\nDotknij SWIR 9.9, aby ponownie uruchomić MOD.")
                    .setNegativeButton("Zamknij", null)
                    .setNeutralButton("Odśwież", (d, w) -> webView.reload())
                    .show();
            return true;
        });

        setContentView(root);
    }

    private void configureWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setLoadsImagesAutomatically(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowContentAccess(true);
        s.setAllowFileAccess(true);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSupportZoom(false);
        s.setJavaScriptCanOpenWindowsAutomatically(true);
        s.setSupportMultipleWindows(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setUserAgentString("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36 CZATeriaPlus/9.9");

        CookieManager cm = CookieManager.getInstance();
        cm.setAcceptCookie(true);
        cm.setAcceptThirdPartyCookies(webView, true);
        webView.setBackgroundColor(Color.rgb(5, 7, 11));

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase(Locale.ROOT);
                if ("http".equals(scheme) || "https".equals(scheme)) {
                    view.loadUrl(uri.toString());
                    return true;
                }
                try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                catch (Exception e) { Toast.makeText(MainActivity.this, "Nie można otworzyć linku.", Toast.LENGTH_SHORT).show(); }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (url != null && url.contains("czateria.interia.pl")) {
                    view.postDelayed(MainActivity.this::injectXBookmark, 500);
                    view.postDelayed(MainActivity.this::injectXBookmark, 2200);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) badge.setText("OFFLINE");
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progress.setProgress(newProgress);
                progress.setVisibility(newProgress >= 100 ? ProgressBar.GONE : ProgressBar.VISIBLE);
                if (newProgress >= 100) badge.setText("SWIR 9.9");
            }

            @Override
            public boolean onShowFileChooser(WebView wv, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent i;
                try { i = params.createIntent(); }
                catch (Exception e) {
                    i = new Intent(Intent.ACTION_GET_CONTENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("image/*");
                }
                try { startActivityForResult(i, FILE_CHOOSER_REQUEST); }
                catch (Exception e) {
                    fileCallback = null;
                    Toast.makeText(MainActivity.this, "Brak aplikacji do wyboru pliku.", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> {
                    if (Build.VERSION.SDK_INT < 23) {
                        request.grant(request.getResources());
                        return;
                    }
                    boolean cameraNeeded = false;
                    boolean micNeeded = false;
                    for (String r : request.getResources()) {
                        if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r)) cameraNeeded = true;
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) micNeeded = true;
                    }
                    boolean cameraOk = !cameraNeeded || checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
                    boolean micOk = !micNeeded || checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
                    if (cameraOk && micOk) request.grant(request.getResources());
                    else {
                        pendingWebPermission = request;
                        requestPermissions(new String[]{Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO}, WEB_PERMISSION_REQUEST);
                    }
                });
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (Build.VERSION.SDK_INT < 23 ||
                        checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                        checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false);
                    return;
                }
                pendingGeoOrigin = origin;
                pendingGeoCallback = callback;
                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, GEO_PERMISSION_REQUEST);
            }
        });
    }

    private void injectXBookmark() {
        if (webView == null) return;
        webView.evaluateJavascript(xBookmarkLoader, value -> badge.setText("SWIR 9.9"));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || fileCallback == null) return;
        Uri[] results = null;
        if (resultCode == RESULT_OK && data != null) {
            ClipData clip = data.getClipData();
            if (clip != null) {
                results = new Uri[clip.getItemCount()];
                for (int i = 0; i < clip.getItemCount(); i++) results[i] = clip.getItemAt(i).getUri();
            } else if (data.getData() != null) results = new Uri[]{data.getData()};
        }
        fileCallback.onReceiveValue(results);
        fileCallback = null;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == WEB_PERMISSION_REQUEST && pendingWebPermission != null) {
            boolean granted = grantResults.length > 0;
            for (int g : grantResults) if (g != PackageManager.PERMISSION_GRANTED) granted = false;
            if (granted) pendingWebPermission.grant(pendingWebPermission.getResources());
            else pendingWebPermission.deny();
            pendingWebPermission = null;
        }
        if (requestCode == GEO_PERMISSION_REQUEST && pendingGeoCallback != null) {
            boolean granted = false;
            for (int g : grantResults) if (g == PackageManager.PERMISSION_GRANTED) granted = true;
            pendingGeoCallback.invoke(pendingGeoOrigin, granted, false);
            pendingGeoCallback = null;
            pendingGeoOrigin = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else new AlertDialog.Builder(this)
                .setTitle("CZATeria Plus")
                .setMessage("Zamknąć aplikację?")
                .setNegativeButton("Nie", null)
                .setPositiveButton("Tak", (d, w) -> finish())
                .show();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
        }
        super.onDestroy();
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
