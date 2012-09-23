using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MovieReviews
{
    public class MvcApplication : HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
        
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // CUSTOM ROUTE!
            routes.MapRoute("Custom Route",
                            "customroute/{slug}-{id}",
                            new { controller = "Homepage", action = "CustomRoute" },
                            new { id = @"\d+"}); // regex to apply on the {id} component of the query string
            

            // THE DEFAULT ROUTE!
            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Homepage", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);
        }
    }
}