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
    ) {
        val key: String get() = "$channel:$id"
    }

    companion object {
        private const val CHAT_URL = "https://czateria.interia.pl/"
        private const val FILE_CHOOSER_REQUEST = 7001
        private const val PREFS_NAME = "czateria_plus_launcher"
        private const val PREF_VERSION = "selected_version"
        private const val PREF_CATALOG = "versions_catalog_cache"
        private const val CATALOG_URL = "https://raw.githubusercontent.com/Swir/XBookmark/main/versions.json"
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
    private var selectedVersionKey = "stable:10.17.2"
    private var catalogSource = "fallback"
    private val versions = mutableListOf<ChannelVersion>()

    private val prefs by lazy { getSharedPreferences(PREFS_NAME, MODE_PRIVATE) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.rgb(4, 12, 20)
        window.navigationBarColor = Color.rgb(4, 12, 20)

        mobileScript = readAsset("swir_mobile_99.js")
        layoutScript = readAsset("swir_mobile_hotfix_061.js")
        featureScript = readAsset("swir_mobile_hotfix_062.js")
        adFixScript = readAsset("swir_mobile_hotfix_063.js")

        seedFallbackVersions()
        selectedVersionKey = prefs.getString(PREF_VERSION, versions.first().key) ?: versions.first().key
        loadCachedCatalog()
        ensureSelectedVersion()

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
        refreshCatalog(silent = true)
    }

    private fun seedFallbackVersions() {
        versions.clear()
        versions += ChannelVersion(
            "stable", "10.17.2", "10.17.2 STABLE — RECOMMENDED", "RECOMMENDED",
            "82c16fa72b16ce8a83fc496ed3b33f5df665a53a", "swir-stable-10172.js",
            "Aktualny Stable.", "#00E5FF"
        )
        versions += ChannelVersion(
            "stable", "10.17.1", "10.17.1 STABLE — ROLLBACK", "STABLE",
            "ca44d190ed8dfbad4b2e7dc90963f19e9d780dd4", "swir-stable-10171.js",
            "Poprzedni Stable — szybki rollback.", "#00C6E8"
        )
        versions += ChannelVersion(
            "stable", "9.9.2", "9.9.2 STABLE — ROLLBACK", "STABLE",
            "c16d6ec57b9063cd9c731f501e5c0cc14adb5c60", "swir-stable-992.js",
            "Starszy sprawdzony Stable.", "#00AFCF"
        )
        versions += ChannelVersion(
            "beta", "10.29-beta", "10.29 BETA — SYMBOL SAFE NICKS", "BETA",
            "f5f9d7fd27fcd4e6e8eca13115cf5daf26a0ac9b", "swir-beta-1029.js",
            "Najnowsza Beta — bezpieczne nicki z symbolami.", "#FF69DF"
        )
        versions += ChannelVersion(
            "beta", "10.28-beta", "10.28 BETA — ACK ROUTE GUARD", "BETA",
            "805ef6445c59ad1e0bee6c0a86e0d0d90aac6ded", "swir-beta-1028.js",
            "Poprzednia Beta — rollback.", "#E95CCB"
        )
        versions += ChannelVersion(
            "beta", "10.27-beta", "10.27 BETA — ACK ROUTE PIN", "BETA",
            "f92d5a06a4281f3835e55319d7fcd0a54ce2751a", "swir-beta-1027.js",
            "Trzecia najnowsza Beta — rollback.", "#D94FBC"
        )
    }

    private fun loadCachedCatalog() {
        val raw = prefs.getString(PREF_CATALOG, null) ?: return
        val parsed = parseCatalog(raw) ?: return
        versions.clear()
        versions.addAll(parsed)
        catalogSource = "cache"
    }

    private fun refreshCatalog(silent: Boolean) {
        if (!silent) {
            launcherOverlay?.findViewWithTag<TextView>("catalog_status")?.text =
                "⏳ Pobieram 3 najnowsze Stable i 3 najnowsze Beta…"
        }

        Thread {
            try {
                val conn = (URL(CATALOG_URL).openConnection() as HttpURLConnection).apply {
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

                val parsed = parseCatalog(raw) ?: throw IllegalStateException("Nieprawidłowy versions.json")
                prefs.edit().putString(PREF_CATALOG, raw).apply()

                runOnUiThread {
                    versions.clear()
                    versions.addAll(parsed)
                    catalogSource = "online"
                    ensureSelectedVersion()
                    updateHeaderStatus()
                    if (launcherOverlay != null) showLauncher()
                }
            } catch (_: Exception) {
                runOnUiThread {
                    catalogSource = if (prefs.contains(PREF_CATALOG)) "cache" else "fallback"
                    launcherOverlay?.findViewWithTag<TextView>("catalog_status")?.text = when (catalogSource) {
                        "cache" -> "📦 Offline — używam ostatniego katalogu"
                        else -> "📦 Offline — używam 6 wersji awaryjnych"
                    }
                }
            }
        }.start()
    }

    private fun parseCatalog(raw: String): List<ChannelVersion>? {
        return try {
            val root = JSONObject(raw)
            val array = root.getJSONArray("versions")
            val stable = mutableListOf<ChannelVersion>()
            val beta = mutableListOf<ChannelVersion>()

            for (i in 0 until array.length()) {
                val o = array.getJSONObject(i)
                val channel = o.optString("channel").lowercase()
                if (channel != "stable" && channel != "beta") continue

                val target = if (channel == "stable") stable else beta
                if (target.size >= 3) continue

                val id = o.getString("id").trim()
                val ref = o.getString("ref").trim()
                val file = o.getString("file").trim()
                if (id.isBlank() || ref.isBlank() || file.isBlank()) continue

                val newest = target.isEmpty()
                target += ChannelVersion(
                    channel = channel,
                    id = id,
                    label = o.optString("label", id),
                    badge = when {
                        channel == "stable" && newest -> "RECOMMENDED"
                        channel == "stable" -> "STABLE"
                        else -> "BETA"
                    },
                    ref = ref,
                    file = file,
                    description = o.optString("notes", ""),
                    accent = if (channel == "beta") "#FF69DF" else "#00E5FF"
                )
            }

            if (stable.isEmpty() || beta.isEmpty()) null else stable + beta
        } catch (_: Exception) {
            null
        }
    }

    private fun ensureSelectedVersion() {
        if (versions.none { it.key == selectedVersionKey }) {
            selectedVersionKey = versions.firstOrNull { it.channel == "stable" }?.key
                ?: versions.first().key
            prefs.edit().putString(PREF_VERSION, selectedVersionKey).apply()
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
        row.addView(topButton("👥 Znajomi") {
            runJs("window.SWIR_APP&&SWIR_APP.openFriends&&SWIR_APP.openFriends();")
        })
        row.addView(topButton("🌈 Kolor") {
            runJs("window.SWIR_COLOR_MOBILE&&SWIR_COLOR_MOBILE.open&&SWIR_COLOR_MOBILE.open();")
        })
        row.addView(topButton("⚙ Ustawienia") {
            runJs("window.SWIR_APP&&SWIR_APP.openPanel&&SWIR_APP.openPanel();")
        })
        row.addView(topButton("↻ Odśwież") {
            if (chatStarted) webView.reload()
        })

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
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                dp(40)
            ).apply {
                marginStart = dp(3)
                marginEnd = dp(3)
            }
            setOnClickListener { click() }
        }
    }

    private fun showLauncher() {
        launcherOverlay?.let { rootFrame.removeView(it) }

        val overlay = FrameLayout(this).apply {
            setBackgroundColor(Color.argb(244, 3, 9, 15))
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
            setPadding(dp(12), dp(18), dp(12), dp(24))
        }
        scroll.addView(
            body,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            )
        )

        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(14), dp(14), dp(14), dp(14))
            background = roundedBg("#081522", "#176681", 18)
        }
        body.addView(
            card,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        )

        val titleRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        card.addView(titleRow)

        val title = TextView(this).apply {
            text = "⚡ CZATeria Plus Launcher"
            textSize = 19f
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
            text = "Wybierz jedną z 3 najnowszych wersji Stable albo 3 najnowszych Beta. Lista jest pobierana bezpośrednio z versions.json."
            textSize = 12f
            setTextColor(Color.rgb(151, 176, 194))
            setPadding(0, dp(7), 0, dp(8))
        }
        card.addView(sub)

        val catalogStatus = TextView(this).apply {
            tag = "catalog_status"
            text = when (catalogSource) {
                "online" -> "● Katalog online — 3 Stable + 3 Beta"
                "cache" -> "📦 Katalog z pamięci — sprawdzam aktualizację…"
                else -> "⏳ Sprawdzam najnowsze wersje…"
            }
            textSize = 11f
            setTextColor(Color.rgb(117, 225, 245))
            setPadding(0, 0, 0, dp(10))
        }
        card.addView(catalogStatus)

        addSectionHeader(card, "🛡️ STABLE", "3 ostatnie stabilne wersje", "#00E5FF")
        versions.filter { it.channel == "stable" }.take(3).forEachIndexed { index, v ->
            card.addView(buildVersionCard(v, index == 0))
        }

        addSectionHeader(card, "🧪 BETA", "3 ostatnie wersje testowe", "#FF69DF")
        versions.filter { it.channel == "beta" }.take(3).forEachIndexed { index, v ->
            card.addView(buildVersionCard(v, index == 0))
        }

        val refresh = Button(this).apply {
            text = "↻ Sprawdź najnowsze wersje"
            isAllCaps = false
            textSize = 12f
            setTextColor(Color.WHITE)
            background = roundedBg("#102333", "#2C5268", 12)
            setOnClickListener { refreshCatalog(silent = false) }
        }
        card.addView(
            refresh,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dp(46)
            ).apply { topMargin = dp(8) }
        )

        val note = TextView(this).apply {
            text = "Po aktualizacji XBookmark launcher automatycznie pokaże nowe TOP 3. Wybrana wersja jest zapamiętywana, dopóki pozostaje w aktualnej liście."
            textSize = 10f
            setTextColor(Color.rgb(108, 134, 153))
            setPadding(dp(2), dp(10), dp(2), 0)
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

    private fun addSectionHeader(parent: LinearLayout, title: String, subtitle: String, accent: String) {
        val wrap = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(2), dp(10), dp(2), dp(7))
        }
        wrap.addView(TextView(this).apply {
            text = title
            textSize = 14f
            setTextColor(safeColor(accent, Color.WHITE))
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        })
        wrap.addView(TextView(this).apply {
            text = subtitle
            textSize = 10f
            setTextColor(Color.rgb(116, 143, 161))
        })
        parent.addView(wrap)
    }

    private fun buildVersionCard(v: ChannelVersion, newest: Boolean): View {
        val accent = safeColor(
            v.accent,
            if (v.channel == "beta") Color.rgb(255, 105, 223) else Color.rgb(0, 229, 255)
        )
        val selected = selectedVersionKey == v.key

        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(12), dp(11), dp(12), dp(11))
            background = roundedBg(
                if (selected) "#123044" else "#0D1C2A",
                if (selected) "#FFFFFF" else v.accent,
                13
            )
        }

        val heading = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        box.addView(heading)

        val name = TextView(this).apply {
            text = v.label
            textSize = 14f
            setTextColor(Color.WHITE)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
        heading.addView(name, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))

        val badge = TextView(this).apply {
            text = if (selected) "WYBRANA" else if (newest) v.badge else v.channel.uppercase()
            textSize = 8f
            setTextColor(if (selected) Color.WHITE else accent)
            gravity = Gravity.CENTER
            setPadding(dp(7), dp(3), dp(7), dp(3))
            background = roundedBg("#111C27", if (selected) "#FFFFFF" else v.accent, 16)
        }
        heading.addView(badge)

        if (v.description.isNotBlank()) {
            box.addView(TextView(this).apply {
                text = v.description
                textSize = 10f
                setTextColor(Color.rgb(154, 177, 194))
                setPadding(0, dp(6), 0, dp(8))
            })
        }

        val button = Button(this).apply {
            text = if (selected && chatStarted) "✓ URUCHOM PONOWNIE ${v.id}" else "URUCHOM ${v.id}"
            isAllCaps = false
            textSize = 11f
            setTextColor(Color.WHITE)
            background = roundedBg(
                if (v.channel == "beta") "#36142F" else "#0A3040",
                v.accent,
                10
            )
            setOnClickListener { chooseVersion(v) }
        }
        box.addView(button, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(44)))

        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            addView(
                box,
                LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = dp(8) }
            )
        }
    }

    private fun chooseVersion(v: ChannelVersion) {
        selectedVersionKey = v.key
        prefs.edit().putString(PREF_VERSION, selectedVersionKey).apply()
        removeLauncher()
        statusText.text = "${v.channel.uppercase()} ${v.id} • START"

        if (!chatStarted) {
            chatStarted = true
            webView.loadUrl(CHAT_URL)
        } else {
            webView.reload()
        }
    }

    private fun currentVersion(): ChannelVersion {
        return versions.firstOrNull { it.key == selectedVersionKey }
            ?: versions.firstOrNull { it.channel == "stable" }
            ?: versions.first()
    }

    private fun updateHeaderStatus() {
        if (!chatStarted) {
            statusText.text = "WYBIERZ WERSJĘ"
            return
        }
        val v = currentVersion()
        statusText.text = "${v.channel.uppercase()} ${v.id}"
    }

    private fun removeLauncher() {
        launcherOverlay?.let { rootFrame.removeView(it) }
        launcherOverlay = null
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
                statusText.text = "${v.channel.uppercase()} ${v.id} • DOPASOWUJĘ…"
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedVersion() }, 350)
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedVersion() }, 1100)
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedVersion() }, 2600)
                Handler(Looper.getMainLooper()).postDelayed({ injectSelectedVersion() }, 5200)
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

    private fun injectSelectedVersion() {
        if (!chatStarted) return
        val v = currentVersion()
        val key = v.key + ":" + v.ref
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
                    statusText.text = "${v.channel.uppercase()} ${v.id} • WYBIERZ POKÓJ"
                }
                result?.contains("ERROR") == true -> {
                    statusText.text = "${v.channel.uppercase()} ${v.id} • BŁĄD"
                }
                result?.contains("READY") == true -> {
                    injectMobileCompanion()
                    statusText.text = "${v.channel.uppercase()} ${v.id} ✓"
                }
                else -> {
                    statusText.text = "${v.channel.uppercase()} ${v.id} • ŁADUJĘ…"
                    Handler(Looper.getMainLooper()).postDelayed({ injectMobileCompanion() }, 800)
                    Handler(Looper.getMainLooper()).postDelayed({ verifySelectedVersion() }, 1700)
                    Handler(Looper.getMainLooper()).postDelayed({ verifySelectedVersion() }, 3600)
                }
            }
        }
    }

    private fun verifySelectedVersion() {
        val v = currentVersion()
        val key = jsString(v.key + ":" + v.ref)
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
                    statusText.text = "${v.channel.uppercase()} ${v.id} ✓"
                }
                result?.contains("ERROR") == true -> {
                    injectMobileCompanion()
                    statusText.text = "${v.channel.uppercase()} ${v.id} • CORE BŁĄD / MOBILE ✓"
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
        return try {
            Color.parseColor(value)
        } catch (_: Exception) {
            fallback
        }
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    @Deprecated("Deprecated in Android SDK, kept for compatibility")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == FILE_CHOOSER_REQUEST) {
            val results = if (resultCode == RESULT_OK && data?.data != null) {
                arrayOf(data.data!!)
            } else {
                null
            }
            filePathCallback?.onReceiveValue(results)
            filePathCallback = null
        }
    }

    override fun onBackPressed() {
        if (launcherOverlay != null && chatStarted) {
            removeLauncher()
            return
        }
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
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
