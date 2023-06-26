const TOKEN_COLORS: any = {
    "BNB": "#ebc509",
    "BTC": "#F2A900",
    "DOGE": "#cb9800",
    "ETH": "#8A94B1",
    "INJ": "#0386FA",
    "KPEPE": "#509844",
    "MATIC": "#8C35D5",
    "Other": "#BBBAC6",
    "SOL": "#C867F0",
    "AVAX": "#e74242",
    "LTC": "#CCCCCC",
    "ARB": "#FCA100",
    "LINK": "#81D2FD",
    "APE": "#4087BE",
    "ATOM": "#FCA100",
    "CFX": "#F3654E",
    "CRV": "#850087",
    "DYDX": "#BE586C",
    "FTM": "#568EC0",
    "GMX": "#59C782",
    "LDO": "#DB6ED7",
    "OP": "#7F0182",
    "RNDR": "#FFA300",
    "SNX": "#498548",
    "STX": "#578374",
    "SUI": "#6A807A"
}

export const getTokenHex = (token: string) => {
    const symbol = token.toUpperCase()
    if (TOKEN_COLORS[symbol]) {
        return TOKEN_COLORS[symbol];
    } else {
        return "pink"
    }
}