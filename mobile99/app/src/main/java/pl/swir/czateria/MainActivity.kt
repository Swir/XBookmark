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
import android.widget.LinearLayout
import android.widget.TextView
import java.io.BufferedReader
import java.io.InputStreamReader

class MainActivity : Activity() {

    companion object {
        private const val CHAT_URL = "https://czateria.interia.pl/emb-chat"
        private const val FILE_CHOOSER_REQUEST = 7001
    }

    private lateinit var webView: WebView
    private lateinit var statusText: TextView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var mobileScript = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mobileScript = readAsset("swir_mobile_99.js")

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(7, 17, 27))
        }

        root.addView(buildHeader())

        webView = WebView(this)
        root.addView(
            webView,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        )

        root.addView(buildBottomBar())
        setContentView(root)
        configureWebView()

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl(CHAT_URL)
        }
    }

    private fun buildHeader(): View {
        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(12), dp(7), dp(10), dp(7))
            setBackgroundColor(Color.rgb(7, 17, 27))
        }

        val title = TextView(this).apply {
            text = "⚡ CZATeria Plus"
            setTextColor(Color.WHITE)
            textSize = 16f
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, 0, dp(10), 0)
        }
        bar.addView(title, LinearLayout.LayoutParams(0, dp(34), 1f))

        statusText = TextView(this).apply {
            text = "MOBILE • XBM 9.9"
            setTextColor(Color.rgb(117, 225, 245))
            textSize = 10f
            gravity = Gravity.CENTER
            setPadding(dp(8), 0, dp(8), 0)
            setBackgroundColor(Color.rgb(12, 38, 53))
        }
        bar.addView(statusText, LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, dp(28)))
        return bar
    }

    private fun buildBottomBar(): View {
        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(dp(6), dp(5), dp(6), dp(7))
            setBackgroundColor(Color.rgb(7, 17, 27))
        }

        bar.addView(navButton("💬\nCzat") {
            runJs("window.SWIR_APP&&SWIR_APP.closeAll&&SWIR_APP.closeAll();")
        })
        bar.addView(navButton("👥\nZnajomi") {
            runJs("window.SWIR_APP&&SWIR_APP.openFriends&&SWIR_APP.openFriends();")
        })
        bar.addView(navButton("⚡\nUstawienia") {
            runJs("window.SWIR_APP&&SWIR_APP.openPanel&&SWIR_APP.openPanel();")
        })
        bar.addView(navButton("↻\nOdśwież") {
            webView.reload()
        })
        return bar
    }

    private fun navButton(label: String, click: () -> Unit): Button {
        return Button(this).apply {
            text = label
            isAllCaps = false
            textSize = 11f
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.rgb(14, 35, 51))
            setPadding(dp(2), 0, dp(2), 0)
            minWidth = 0
            minHeight = 0
            layoutParams = LinearLayout.LayoutParams(0, dp(50), 1f).apply {
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
                statusText.text = "ŁADOWANIE…"
                Handler(Looper.getMainLooper()).postDelayed({ injectMobile() }, 900)
                Handler(Looper.getMainLooper()).postDelayed({ injectMobile() }, 2600)
                Handler(Looper.getMainLooper()).postDelayed({ injectMobile() }, 5200)
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
                    statusText.text = "MOBILE • XBM 9.9 ✓"
                }
                result?.contains("ALREADY") == true -> statusText.text = "MOBILE • XBM 9.9 ✓"
                else -> statusText.text = "CZEKAM NA CZAT…"
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
