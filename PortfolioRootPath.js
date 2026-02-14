let PortfolioRootPath = import.meta.url;
export function GetPathFromPortfolioRoot(portfolioURL)
{
    if (!portfolioURL.startsWith("_./"))
    {
        console.error("GetPathFromPortfolioRoot: URL must start with '_./'");
        return portfolioURL;
    }
    portfolioURL = portfolioURL.substring(1);
    return new URL(portfolioURL, PortfolioRootPath).href;
}