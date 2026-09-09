package pl.swir.czateria

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.HorizontalScrollView
import android.widget.LinearLayout
import android.widget.TextView
import java.io.BufferedReader
import java.io.InputStreamReader

class MainActivity : Activity() {

    companion object {
        private const val CHAT_URL = "https://czateria.interia.pl/"
        private const val FILE_CHOOSER_REQUEST = 7001
    }

    private lateinit var webView: WebView
    private lateinit var statusText: TextView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var mobileScript = ""
    private var layoutScript = ""
    private var featureScript = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mobileScript = readAsset("swir_mobile_99.js")
        layoutScript = readAsset("swir_mobile_hotfix_061.js")
        featureScript = readAsset("swir_mobile_hotfix_062.js")

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(7, 17, 27))
        }

        root.addView(buildTopMenu())

        webView = WebView(this)
        root.addView(
            webView,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        )

        setContentView(root)
        configureWebView()

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl(CHAT_URL)
        }
    }

    private fun buildTopMenu(): View {
        val outer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(7, 17, 27))
        }

        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(10), dp(5), dp(8), dp(3))
        }

        val title = TextView(this).apply {
            text = "⚡ CZATeria Plus"
            setTextColor(Color.WHITE)
            textSize = 15f
            gravity = Gravity.CENTER_VERTICAL
        }
        header.addView(title, LinearLayout.LayoutParams(0, dp(30), 1f))

        statusText = TextView(this).apply {
            text = "MOBILE 0.6.2"
            setTextColor(Color.rgb(117, 225, 245))
            textSize = 9f
            gravity = Gravity.CENTER
            setPadding(dp(7), 0, dp(7), 0)
            setBackgroundColor(Color.rgb(12, 38, 53))
        }
        header.addView(statusText, LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, dp(24)))
        outer.addView(header)

        val scroll = HorizontalScrollView(this).apply {
            isHorizontalScrollBarEnabled = false
            overScrollMode = View.OVER_SCROLL_NEVER
            setBackgroundColor(Color.rgb(7, 17, 27))
            isFillViewport = false
        }

        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(5), dp(2), dp(5), dp(5))
        }

        row.addView(topButton("🏠 Pokoje") { webView.loadUrl(CHAT_URL) })
        row.addView(topButton("💬 Czat") { runJs("window.SWIR_APP&&SWIR_APP.closeAll&&SWIR_APP.closeAll();") })
        row.addView(topButton("🌈 Kolor") { runJs("window.SWIR_COLOR_MOBILE&&SWIR_COLOR_MOBILE.open&&SWIR_COLOR_MOBILE.open();") })
        row.addView(topButton("👥 Znajomi") { runJs("window.SWIR_APP&&SWIR_APP.openFriends&&SWIR_APP.openFriends();") })
        row.addView(topButton("⚙ Ustawienia") { runJs("window.SWIR_APP&&SWIR_APP.openPanel&&SWIR_APP.openPanel();") })
        row.addView(topButton("↻ Odśwież") { webView.reload() })

        scroll.addView(row)
        outer.addView(scroll, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(48)))
        return outer
    }

    private fun topButton(label: String, click: () -> Unit): Button {
        return Button(this).apply {
            text = label
            isAllCaps = false
            textSize = 11f
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.rgb(14, 35, 51))
            setPadding(dp(10), 0, dp(10), 0)
            minWidth = 0
            minHeight = 0
            layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, dp(40)).apply {
                marginStart = dp(3)
                marginEnd = dp(3)
            }
            setOnClickListener { click() }
        }
    }

    private fun configureWebView() {
        WebView.setWebContentsDebuggingEnabled(false)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = true
            allowContentAccess = true
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(false)
            builtInZoomControls = false
            displayZoomControls = false
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            textZoom = 100
            useWideViewPort = false
            loadWithOverviewMode = false
        }

        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, true)
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val uri = request?.url ?: return false
                val host = uri.host ?: return false
                return if (host.endsWith("interia.pl")) {
                    false
                } else {
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, uri))
                        true
                    } catch (_: Exception) {
                        false
                    }
                }
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                injectPatches()
                statusText.text = "DOPASOWUJĘ…"
                Handler(Looper.getMainLooper()).postDelayed({ injectPatches() }, 350)
                Handler(Looper.getMainLooper()).postDelayed({ injectMobile() }, 900)
                Handler(Looper.getMainLooper()).postDelayed({ injectPatches(); injectMobile() }, 2400)
                Handler(Looper.getMainLooper()).postDelayed({ injectPatches(); injectMobile() }, 5000)
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                }

                return try {
                    startActivityForResult(Intent.createChooser(intent, "Wybierz plik"), FILE_CHOOSER_REQUEST)
                    true
                } catch (_: Exception) {
                    this@MainActivity.filePathCallback = null
                    false
                }
            }
        }
    }

    private fun injectPatches() {
        if (layoutScript.isNotBlank()) webView.evaluateJavascript(layoutScript, null)
        if (featureScript.isNotBlank()) webView.evaluateJavascript(featureScript, null)
    }

    private fun injectMobile() {
        if (mobileScript.isBlank()) return
        webView.evaluateJavascript(
            """
            (function(){
              if(typeof CHNS === 'undefined') return 'WAIT';
              if(window.__SWIR_MOBILE_99_INJECTED) return 'ALREADY';
              window.__SWIR_MOBILE_99_INJECTED = true;
              return 'READY';
            })();
            """.trimIndent()
        ) { result ->
            when {
                result?.contains("READY") == true -> {
                    webView.evaluateJavascript(mobileScript, null)
                    injectPatches()
                    statusText.text = "MOBILE 0.6.2 ✓"
                }
                result?.contains("ALREADY") == true -> {
                    injectPatches()
                    statusText.text = "MOBILE 0.6.2 ✓"
                }
                else -> statusText.text = "WYBIERZ POKÓJ"
            }
        }
    }

    private fun runJs(code: String) {
        webView.evaluateJavascript("(function(){try{$code}catch(e){console.error(e)}})();", null)
    }

    private fun readAsset(name: String): String = assets.open(name).use { input ->
        BufferedReader(InputStreamReader(input)).readText()
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    @Deprecated("Deprecated in Android SDK, kept for compatibility")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == FILE_CHOOSER_REQUEST) {
            val results = if (resultCode == RESULT_OK && data?.data != null) arrayOf(data.data!!) else null
            filePathCallback?.onReceiveValue(results)
            filePathCallback = null
        }
    }

    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        if (::webView.isInitialized) webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }
}
