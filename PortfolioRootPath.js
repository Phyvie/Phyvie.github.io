let PortfolioRootPath = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));
export function GetPathFromPortfolioRoot(portfolioURL)
{
    if (!portfolioURL.startsWith(".P/"))
    {
        console.error("GetPathFromPortfolioRoot: URL must start with '.P/'");
        return portfolioURL;
    }
    portfolioURL = portfolioURL.substring(2);
    return new URL(portfolioURL, PortfolioRootPath).href;
}