package pl.swir.czateria

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.HorizontalScrollView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : Activity() {

    data class ChannelVersion(
        val channel: String,
        val id: String,
        val label: String,
        val badge: String,
        val ref: String,
        val file: String,
        val description: String,
        val accent: String
    )

    companion object {
        private const val CHAT_URL = "https://czateria.interia.pl/"
        private const val FILE_CHOOSER_REQUEST = 7001
        private const val PREFS_NAME = "czateria_plus_launcher"
        private const val PREF_CHANNEL = "selected_channel"
        private const val PREF_MANIFEST = "channel_manifest_cache"
        private const val MANIFEST_URL = "https://raw.githubusercontent.com/Swir/XBookmark/czateria-plus-mobile-99/mobile99/channel-manifest.json"
        private const val CDN_BASE = "https://cdn.jsdelivr.net/gh/Swir/XBookmark@"
    }

    private lateinit var rootFrame: FrameLayout
    private lateinit var webView: WebView
    private lateinit var statusText: TextView
    private var launcherOverlay: View? = null
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var mobileScript = ""
    private var layoutScript = ""
    private var featureScript = ""
    private var adFixScript = ""
    private var chatStarted = false
    private var selectedChannel = "stable"
    private var manifestSource = "fallback"
    private val channels = linkedMapOf<String, ChannelVersion>()

    private val prefs by lazy { getSharedPreferences(PREFS_NAME, MODE_PRIVATE) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.rgb(4, 12, 20)
        window.navigationBarColor = Color.rgb(4, 12, 20)

        mobileScript = readAsset("swir_mobile_99.js")
        layoutScript = readAsset("swir_mobile_hotfix_061.js")
        featureScript = readAsset("swir_mobile_hotfix_062.js")
        adFixScript = readAsset("swir_mobile_hotfix_063.js")

        seedFallbackChannels()
        selectedChannel = prefs.getString(PREF_CHANNEL, "stable")?.takeIf { it == "stable" || it == "beta" } ?: "stable"
        loadCachedManifest()

        rootFrame = FrameLayout(this).apply {
            setBackgroundColor(Color.rgb(7, 17, 27))
        }

        val appRoot = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(7, 17, 27))
        }
        rootFrame.addView(
            appRoot,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )

        appRoot.addView(buildTopMenu())

        webView = WebView(this)
        appRoot.addView(
            webView,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        )

        setContentView(rootFrame)
        configureWebView()

        if (savedInstanceState != null && webView.restoreState(savedInstanceState) != null) {
            chatStarted = true
        }

        showLauncher()
        refreshChannelManifest(silent = true)
    }

    private fun seedFallbackChannels() {
        channels["stable"] = ChannelVersion(
            channel = "stable",
            id = "9.9",
            label = "XBookmark 9.9",
            badge = "RECOMMENDED",
            ref = "8ef1a5773f98780094c65042c2e622852ea6eb29",
            file = "swir.js",
            description = "Sprawdzona wersja Stable. Friend Radar, szybkie akcje, motywy i stabilna baza 9.9.",
            accent = "#00E5FF"
        )
        channels["beta"] = ChannelVersion(
            channel = "beta",
            id = "10.1-beta",
            label = "XBookmark 10.1 BETA",
            badge = "BETA",
            ref = "czateria-plus-mobile-99",
            file = "swir-beta-101.js",
            description = "Najnowszy kanał testowy z nowymi funkcjami. Może zmieniać się częściej niż Stable.",
            accent = "#FF69DF"
        )
    }

    private fun loadCachedManifest() {
        val cached = prefs.getString(PREF_MANIFEST, null) ?: return
        val parsed = parseManifest(cached) ?: return
        channels.clear()
        channels.putAll(parsed)
        manifestSource = "cache"
    }

    private fun refreshChannelManifest(silent: Boolean) {
        if (!silent) {
            launcherOverlay?.findViewWithTag<TextView>("catalog_status")?.text = "⏳ Sprawdzam najnowsze Stable i Beta…"
        }
        Thread {
            try {
                val conn = (URL(MANIFEST_URL).openConnection() as HttpURLConnection).apply {
                    connectTimeout = 7000
                    readTimeout = 7000
                    requestMethod = "GET"
                    useCaches = false
                    setRequestProperty("Cache-Control", "no-cache")
                    setRequestProperty("User-Agent", "CZATeria-Plus-Android")
                }
                val code = conn.responseCode
                if (code !in 200..299) throw IllegalStateException("HTTP $code")
                val raw = conn.inputStream.bufferedReader().use { it.readText() }
                conn.disconnect()
                val parsed = parseManifest(raw) ?: throw IllegalStateException("Nieprawidłowy katalog")
                prefs.edit().putString(PREF_MANIFEST, raw).apply()
                runOnUiThread {
                    channels.clear()
                    channels.putAll(parsed)
                    manifestSource = "online"
                    if (launcherOverlay != null) showLauncher()
                    updateHeaderStatus()
                }
            } catch (_: Exception) {
                runOnUiThread {
                    manifestSource = if (prefs.contains(PREF_MANIFEST)) "cache" else "fallback"
                    launcherOverlay?.findViewWithTag<TextView>("catalog_status")?.text = when (manifestSource) {
                        "cache" -> "📦 Offline — używam ostatniego zapamiętanego katalogu"
                        else -> "📦 Offline — używam bezpiecznych wersji awaryjnych"
                    }
                }
            }
        }.start()
    }

    private fun parseManifest(raw: String): LinkedHashMap<String, ChannelVersion>? {
        return try {
            val root = JSONObject(raw)
            val out = linkedMapOf<String, ChannelVersion>()
            listOf("stable", "beta").forEach { channel ->
                val o = root.getJSONObject(channel)
                val ref = o.getString("ref").trim()
                val file = o.getString("file").trim()
                if (ref.isBlank() || file.isBlank()) return null
                out[channel] = ChannelVersion(
                    channel = channel,
                    id = o.getString("id"),
                    label = o.optString("label", o.getString("id")),
                    badge = o.optString("badge", channel.uppercase()),
                    ref = ref,
                    file = file,
                    description = o.optString("description", ""),
                    accent = o.optString("accent", if (channel == "beta") "#FF69DF" else "#00E5FF")
                )
            }
            out
        } catch (_: Exception) {
            null
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
            text = "WYBIERZ WERSJĘ"
            setTextColor(Color.rgb(117, 225, 245))
            textSize = 9f
            gravity = Gravity.CENTER
            setPadding(dp(7), 0, dp(7), 0)
            background = roundedBg("#0C2635", "#1D637A", 8)
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

        row.addView(topButton("🚀 Wersje") { showLauncher() })
        row.addView(topButton("👥 Znajomi") { runJs("window.SWIR_APP&&SWIR_APP.openFriends&&SWIR_APP.openFriends();") })
        row.addView(topButton("🌈 Kolor") { runJs("window.SWIR_COLOR_MOBILE&&SWIR_COLOR_MOBILE.open&&SWIR_COLOR_MOBILE.open();") })
        row.addView(topButton("⚙ Ustawienia") { runJs("window.SWIR_APP&&SWIR_APP.openPanel&&SWIR_APP.openPanel();") })
        row.addView(topButton("↻ Odśwież") { if (chatStarted) webView.reload() })

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
            background = roundedBg("#0E2333", "#24485E", 10)
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

    private fun showLauncher() {
        launcherOverlay?.let { rootFrame.removeView(it) }

        val overlay = FrameLayout(this).apply {
            setBackgroundColor(Color.argb(242, 3, 9, 15))
            isClickable = true
            isFocusable = true
        }

        val scroll = ScrollView(this).apply {
            isFillViewport = true
            overScrollMode = View.OVER_SCROLL_NEVER
        }
        overlay.addView(
            scroll,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )

        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(dp(14), dp(24), dp(14), dp(24))
        }
        scroll.addView(
            body,
            ScrollView.LayoutParams(
                ScrollView.LayoutParams.MATCH_PARENT,
                ScrollView.LayoutParams.WRAP_CONTENT
            )
        )

        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(16), dp(16), dp(16))
            background = roundedBg("#081522", "#176681", 20)
        }
        body.addView(
            card,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = dp(10)
                bottomMargin = dp(10)
            }
        )

        val titleRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        card.addView(titleRow)

        val title = TextView(this).apply {
            text = "⚡ CZATeria Plus Launcher"
            textSize = 20f
            setTextColor(Color.WHITE)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
        titleRow.addView(title, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

        if (chatStarted) {
            val close = Button(this).apply {
                text = "✕"
                isAllCaps = false
                textSize = 16f
                minWidth = 0
                minHeight = 0
                setTextColor(Color.WHITE)
                background = roundedBg("#122536", "#31536A", 10)
                setOnClickListener { removeLauncher() }
            }
            titleRow.addView(close, LinearLayout.LayoutParams(dp(44), dp(42)))
        }

        val sub = TextView(this).apply {
            text = "Wybierasz kanał, nie numer wersji. Launcher zawsze pobiera najnowszy opublikowany Stable albo Beta."
            textSize = 12f
            setTextColor(Color.rgb(151, 176, 194))
            setPadding(0, dp(7), 0, dp(10))
        }
        card.addView(sub)

        val catalogStatus = TextView(this).apply {
            tag = "catalog_status"
            text = when (manifestSource) {
                "online" -> "● Katalog online — aktualny"
                "cache" -> "📦 Katalog z pamięci — sprawdzam aktualizację…"
                else -> "⏳ Sprawdzam katalog wersji…"
            }
            textSize = 11f
            setTextColor(Color.rgb(117, 225, 245))
            setPadding(0, 0, 0, dp(12))
        }
        card.addView(catalogStatus)

        card.addView(buildChannelCard("stable"))
        card.addView(buildChannelCard("beta"))

        val refresh = Button(this).apply {
            text = "↻ Sprawdź najnowsze wersje"
            isAllCaps = false
            textSize = 12f
            setTextColor(Color.WHITE)
            background = roundedBg("#102333", "#2C5268", 12)
            setOnClickListener { refreshChannelManifest(silent = false) }
        }
        card.addView(
            refresh,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dp(46)
            ).apply { topMargin = dp(10) }
        )

        val note = TextView(this).apply {
            text = "Stable jest przypięty do sprawdzonego commita. Beta może aktualizować się częściej. Przy braku internetu używany jest ostatni zapamiętany katalog."
            textSize = 10f
            setTextColor(Color.rgb(108, 134, 153))
            setPadding(dp(2), dp(12), dp(2), 0)
        }
        card.addView(note)

        launcherOverlay = overlay
        rootFrame.addView(
            overlay,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )
    }

    private fun buildChannelCard(channel: String): View {
        val v = channels[channel] ?: return View(this)
        val accent = safeColor(v.accent, if (channel == "beta") Color.rgb(255, 105, 223) else Color.rgb(0, 229, 255))

        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(14), dp(13), dp(14), dp(13))
            background = roundedBg("#0D1C2A", v.accent, 15)
        }

        val heading = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        box.addView(heading)

        val name = TextView(this).apply {
            text = if (channel == "beta") "🧪 ${v.label}" else "🛡️ ${v.label}"
            textSize = 16f
            setTextColor(Color.WHITE)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
        heading.addView(name, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

        val badge = TextView(this).apply {
            text = v.badge
            textSize = 9f
            setTextColor(accent)
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(4), dp(8), dp(4))
            background = roundedBg("#111C27", v.accent, 20)
        }
        heading.addView(badge)

        val desc = TextView(this).apply {
            text = v.description
            textSize = 11f
            setTextColor(Color.rgb(154, 177, 194))
            setPadding(0, dp(7), 0, dp(10))
        }
        box.addView(desc)

        val selected = selectedChannel == channel
        val button = Button(this).apply {
            text = when {
                selected && chatStarted -> "✓ AKTYWNY KANAŁ — URUCHOM PONOWNIE"
                channel == "beta" -> "URUCHOM NAJNOWSZĄ BETĘ"
                else -> "URUCHOM NAJNOWSZY STABLE"
            }
            isAllCaps = false
            textSize = 12f
            setTextColor(Color.WHITE)
            background = roundedBg(if (channel == "beta") "#36142F" else "#0A3040", v.accent, 11)
            setOnClickListener { chooseChannel(channel) }
        }
        box.addView(button, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(48)))

        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            addView(
                box,
                LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = dp(10) }
            )
        }
    }

    private fun chooseChannel(channel: String) {
        if (!channels.containsKey(channel)) return
        selectedChannel = channel
        prefs.edit().putString(PREF_CHANNEL, channel).apply()
        removeLauncher()
        val v = currentVersion()
        statusText.text = "${channel.uppercase()} ${v.id} • START"

        if (!chatStarted) {
            chatStarted = true
            webView.loadUrl(CHAT_URL)
        } else {
            webView.reload()
        }
    }

    private fun removeLauncher() {
        launcherOverlay?.let { rootFrame.removeView(it) }
        launcherOverlay = null
    }

    private fun currentVersion(): ChannelVersion {
        return channels[selectedChannel] ?: channels["stable"]!!
    }

    private fun updateHeaderStatus() {
        if (!chatStarted) {
            statusText.text = "WYBIERZ WERSJĘ"
            return
        }
        val v = currentVersion()
        statusText.text = "${selectedChannel.uppercase()} ${v.id}"
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
                val v = currentVersion()
                statusText.text = "${selectedChannel.uppercase()} ${v.id} • DOPASOWUJĘ…"
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedChannel() }, 350)
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedChannel() }, 1100)
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedChannel() }, 2600)
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedChannel() }, 5200)
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

    private fun injectSelectedChannel() {
        if (!chatStarted) return
        val v = currentVersion()
        val key = "${v.channel}:${v.id}:${v.ref}"
        val src = "$CDN_BASE${v.ref}/${v.file}?czp=${System.currentTimeMillis()}"
        val jsKey = jsString(key)
        val jsSrc = jsString(src)

        webView.evaluateJavascript(
            """
            (function(){
              try{
                if(typeof CHNS === 'undefined') return 'WAIT';
                var key='$jsKey';
                if(window.__CZP_CHANNEL_KEY===key && window.__CZP_CHANNEL_READY===key) return 'READY';
                if(window.__CZP_CHANNEL_KEY===key && !window.__CZP_CHANNEL_ERROR) return 'LOADING';
                window.__CZP_CHANNEL_KEY=key;
                window.__CZP_CHANNEL_ERROR='';
                var old=document.getElementById('czp-channel-script');
                if(old) old.remove();
                var s=document.createElement('script');
                s.id='czp-channel-script';
                s.src='$jsSrc';
                s.async=false;
                s.onload=function(){window.__CZP_CHANNEL_READY=key;window.__CZP_CHANNEL_ERROR='';};
                s.onerror=function(){window.__CZP_CHANNEL_ERROR=key;};
                (document.head||document.documentElement).appendChild(s);
                return 'STARTED';
              }catch(e){return 'ERROR:'+String(e&&e.message||e)}
            })();
            """.trimIndent()
        ) { result ->
            when {
                result?.contains("WAIT") == true -> {
                    statusText.text = "${selectedChannel.uppercase()} ${v.id} • WYBIERZ POKÓJ"
                }
                result?.contains("ERROR") == true -> {
                    statusText.text = "${selectedChannel.uppercase()} ${v.id} • BŁĄD"
                }
                result?.contains("READY") == true -> {
                    injectMobileCompanion()
                    statusText.text = "${selectedChannel.uppercase()} ${v.id} ✓"
                }
                else -> {
                    statusText.text = "${selectedChannel.uppercase()} ${v.id} • ŁADUJĘ…"
                    Handler(Looper.getMainLooper()).postDelayed({ injectMobileCompanion() }, 800)
                    Handler(Looper.getMainLooper()).postDelayed({ verifySelectedChannel() }, 1700)
                    Handler(Looper.getMainLooper()).postDelayed({ verifySelectedChannel() }, 3600)
                }
            }
        }
    }

    private fun verifySelectedChannel() {
        val v = currentVersion()
        val key = jsString("${v.channel}:${v.id}:${v.ref}")
        webView.evaluateJavascript(
            """
            (function(){
              if(window.__CZP_CHANNEL_READY==='$key') return 'READY';
              if(window.__CZP_CHANNEL_ERROR==='$key') return 'ERROR';
              return 'WAIT';
            })();
            """.trimIndent()
        ) { result ->
            when {
                result?.contains("READY") == true -> {
                    injectMobileCompanion()
                    statusText.text = "${selectedChannel.uppercase()} ${v.id} ✓"
                }
                result?.contains("ERROR") == true -> {
                    injectMobileCompanion()
                    statusText.text = "${selectedChannel.uppercase()} ${v.id} • CORE BŁĄD / MOBILE ✓"
                }
            }
        }
    }

    private fun injectMobileCompanion() {
        if (mobileScript.isBlank()) return
        webView.evaluateJavascript(
            """
            (function(){
              if(typeof CHNS === 'undefined') return 'WAIT';
              if(window.__CZP_MOBILE_COMPANION) return 'ALREADY';
              window.__CZP_MOBILE_COMPANION=true;
              return 'READY';
            })();
            """.trimIndent()
        ) { result ->
            if (result?.contains("READY") == true) {
                webView.evaluateJavascript(mobileScript, null)
            }
            injectPatches()
        }
    }

    private fun injectPatches() {
        if (layoutScript.isNotBlank()) webView.evaluateJavascript(layoutScript, null)
        if (featureScript.isNotBlank()) webView.evaluateJavascript(featureScript, null)
        if (adFixScript.isNotBlank()) webView.evaluateJavascript(adFixScript, null)
    }

    private fun runJs(code: String) {
        webView.evaluateJavascript("(function(){try{$code}catch(e){console.error(e)}})();", null)
    }

    private fun jsString(value: String): String {
        return value
            .replace("\\", "\\\\")
            .replace("'", "\\'")
            .replace("\r", "\\r")
            .replace("\n", "\\n")
    }

    private fun readAsset(name: String): String = assets.open(name).use { input ->
        BufferedReader(InputStreamReader(input)).readText()
    }

    private fun roundedBg(fill: String, stroke: String, radiusDp: Int): GradientDrawable {
        return GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = dp(radiusDp).toFloat()
            setColor(safeColor(fill, Color.rgb(14, 35, 51)))
            setStroke(dp(1), safeColor(stroke, Color.rgb(36, 72, 94)))
        }
    }

    private fun safeColor(value: String, fallback: Int): Int {
        return try { Color.parseColor(value) } catch (_: Exception) { fallback }
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
        if (launcherOverlay != null && chatStarted) {
            removeLauncher()
            return
        }
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
