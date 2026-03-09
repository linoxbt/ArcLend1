import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      markets: "Markets",
      swap: "Swap",
      liquidity: "Liquidity",
      positions: "Positions",
      staking: "Staking",
      faucet: "Faucet",
      healthMonitor: "Health Monitor",
      liquidation: "Liquidation",
      governance: "Governance",
      community: "Community",
      deploy: "Deploy",
      docs: "Docs",
      analytics: "Analytics",
      
      // Dashboard
      portfolioDashboard: "Portfolio Dashboard",
      connectWallet: "Connect Your Wallet",
      connectWalletDesc: "Connect your EVM wallet to view your portfolio, positions, and earnings.",
      walletValue: "Wallet Value",
      totalSupplied: "Total Supplied",
      totalBorrowed: "Total Borrowed",
      netApy: "Net APY",
      walletBalances: "Wallet Balances",
      recentActivity: "Recent Activity",
      noTransactions: "No recent transactions",
      goToFaucet: "Go to Faucet",
      healthFactor: "Health Factor",
      noActiveBorrows: "No active borrows",
      safe: "Safe",
      earlyWarning: "Early warning",
      caution: "Caution",
      liquidationRisk: "Liquidation risk",
      
      // Protocol Stats
      protocolTvl: "Protocol TVL",
      totalLiquidity: "Total Liquidity",
      activeUsers: "Active Users",
      
      // Analytics
      portfolioAnalytics: "Portfolio Analytics",
      portfolioAllocation: "Portfolio Allocation",
      yieldOverTime: "Yield Over Time",
      pnlHistory: "P&L History",
      
      // Alerts
      priceAlerts: "Price Alerts",
      alertSettings: "Alert Settings",
      setAlert: "Set Alert",
      alertWhen: "Alert when",
      priceAbove: "price above",
      priceBelow: "price below",
      alertCreated: "Alert created",
      alertTriggered: "Alert triggered!",
      currentPrice: "Current price",
      targetPrice: "Target price",
      
      // Common
      connect: "Connect",
      disconnect: "Disconnect",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      settings: "Settings",
      language: "Language",
    },
  },
  es: {
    translation: {
      // Navigation
      dashboard: "Panel",
      markets: "Mercados",
      swap: "Intercambio",
      liquidity: "Liquidez",
      positions: "Posiciones",
      staking: "Staking",
      faucet: "Grifo",
      healthMonitor: "Monitor de Salud",
      liquidation: "Liquidación",
      governance: "Gobernanza",
      community: "Comunidad",
      deploy: "Desplegar",
      docs: "Documentos",
      analytics: "Análisis",
      
      // Dashboard
      portfolioDashboard: "Panel de Cartera",
      connectWallet: "Conecta tu Cartera",
      connectWalletDesc: "Conecta tu cartera EVM para ver tu portafolio, posiciones y ganancias.",
      walletValue: "Valor de Cartera",
      totalSupplied: "Total Suministrado",
      totalBorrowed: "Total Prestado",
      netApy: "APY Neto",
      walletBalances: "Saldos de Cartera",
      recentActivity: "Actividad Reciente",
      noTransactions: "Sin transacciones recientes",
      goToFaucet: "Ir al Grifo",
      healthFactor: "Factor de Salud",
      noActiveBorrows: "Sin préstamos activos",
      safe: "Seguro",
      earlyWarning: "Alerta temprana",
      caution: "Precaución",
      liquidationRisk: "Riesgo de liquidación",
      
      // Protocol Stats
      protocolTvl: "TVL del Protocolo",
      totalLiquidity: "Liquidez Total",
      activeUsers: "Usuarios Activos",
      
      // Analytics
      portfolioAnalytics: "Análisis de Cartera",
      portfolioAllocation: "Asignación de Cartera",
      yieldOverTime: "Rendimiento en el Tiempo",
      pnlHistory: "Historial de P&L",
      
      // Alerts
      priceAlerts: "Alertas de Precio",
      alertSettings: "Configuración de Alertas",
      setAlert: "Crear Alerta",
      alertWhen: "Alertar cuando",
      priceAbove: "precio arriba de",
      priceBelow: "precio abajo de",
      alertCreated: "Alerta creada",
      alertTriggered: "¡Alerta activada!",
      currentPrice: "Precio actual",
      targetPrice: "Precio objetivo",
      
      // Common
      connect: "Conectar",
      disconnect: "Desconectar",
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      settings: "Configuración",
      language: "Idioma",
    },
  },
  zh: {
    translation: {
      // Navigation
      dashboard: "仪表板",
      markets: "市场",
      swap: "兑换",
      liquidity: "流动性",
      positions: "仓位",
      staking: "质押",
      faucet: "水龙头",
      healthMonitor: "健康监控",
      liquidation: "清算",
      governance: "治理",
      community: "社区",
      deploy: "部署",
      docs: "文档",
      analytics: "分析",
      
      // Dashboard
      portfolioDashboard: "投资组合仪表板",
      connectWallet: "连接钱包",
      connectWalletDesc: "连接您的EVM钱包以查看您的投资组合、仓位和收益。",
      walletValue: "钱包价值",
      totalSupplied: "总供应",
      totalBorrowed: "总借款",
      netApy: "净年化收益",
      walletBalances: "钱包余额",
      recentActivity: "最近活动",
      noTransactions: "暂无交易记录",
      goToFaucet: "前往水龙头",
      healthFactor: "健康因子",
      noActiveBorrows: "无活跃借款",
      safe: "安全",
      earlyWarning: "预警",
      caution: "警告",
      liquidationRisk: "清算风险",
      
      // Protocol Stats
      protocolTvl: "协议TVL",
      totalLiquidity: "总流动性",
      activeUsers: "活跃用户",
      
      // Analytics
      portfolioAnalytics: "投资组合分析",
      portfolioAllocation: "投资组合分配",
      yieldOverTime: "收益趋势",
      pnlHistory: "盈亏历史",
      
      // Alerts
      priceAlerts: "价格提醒",
      alertSettings: "提醒设置",
      setAlert: "设置提醒",
      alertWhen: "当以下情况时提醒",
      priceAbove: "价格高于",
      priceBelow: "价格低于",
      alertCreated: "提醒已创建",
      alertTriggered: "提醒已触发！",
      currentPrice: "当前价格",
      targetPrice: "目标价格",
      
      // Common
      connect: "连接",
      disconnect: "断开",
      loading: "加载中...",
      save: "保存",
      cancel: "取消",
      delete: "删除",
      edit: "编辑",
      settings: "设置",
      language: "语言",
    },
  },
  ar: {
    translation: {
      // Navigation
      dashboard: "لوحة التحكم",
      markets: "الأسواق",
      swap: "تبديل",
      liquidity: "السيولة",
      positions: "المراكز",
      staking: "الرهن",
      faucet: "الصنبور",
      healthMonitor: "مراقب الصحة",
      liquidation: "التصفية",
      governance: "الحوكمة",
      community: "المجتمع",
      deploy: "نشر",
      docs: "المستندات",
      analytics: "التحليلات",
      
      // Dashboard
      portfolioDashboard: "لوحة المحفظة",
      connectWallet: "ربط المحفظة",
      connectWalletDesc: "اربط محفظة EVM الخاصة بك لعرض محفظتك ومراكزك وأرباحك.",
      walletValue: "قيمة المحفظة",
      totalSupplied: "إجمالي الإيداع",
      totalBorrowed: "إجمالي الاقتراض",
      netApy: "صافي APY",
      walletBalances: "أرصدة المحفظة",
      recentActivity: "النشاط الأخير",
      noTransactions: "لا توجد معاملات حديثة",
      goToFaucet: "اذهب إلى الصنبور",
      healthFactor: "عامل الصحة",
      noActiveBorrows: "لا توجد قروض نشطة",
      safe: "آمن",
      earlyWarning: "إنذار مبكر",
      caution: "تحذير",
      liquidationRisk: "خطر التصفية",
      
      // Protocol Stats
      protocolTvl: "القيمة المقفلة",
      totalLiquidity: "إجمالي السيولة",
      activeUsers: "المستخدمون النشطون",
      
      // Analytics
      portfolioAnalytics: "تحليلات المحفظة",
      portfolioAllocation: "توزيع المحفظة",
      yieldOverTime: "العائد بمرور الوقت",
      pnlHistory: "تاريخ الربح والخسارة",
      
      // Alerts
      priceAlerts: "تنبيهات السعر",
      alertSettings: "إعدادات التنبيه",
      setAlert: "تعيين تنبيه",
      alertWhen: "تنبيه عندما",
      priceAbove: "السعر فوق",
      priceBelow: "السعر تحت",
      alertCreated: "تم إنشاء التنبيه",
      alertTriggered: "تم تفعيل التنبيه!",
      currentPrice: "السعر الحالي",
      targetPrice: "السعر المستهدف",
      
      // Common
      connect: "ربط",
      disconnect: "قطع الاتصال",
      loading: "جاري التحميل...",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      settings: "الإعدادات",
      language: "اللغة",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
