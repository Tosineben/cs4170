// Type: System.Web.Mvc.AreaRegistration
// Assembly: System.Web.Mvc, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35
// Assembly location: C:\src\Columbia\MovieReviews\packages\Microsoft.AspNet.Mvc.4.0.20710.0\lib\net40\System.Web.Mvc.dll

using System;
using System.Reflection;
using System.Web.Routing;

namespace System.Web.Mvc
{
  /// <summary>
  /// Provides a way to register one or more areas in an ASP.NET MVC application.
  /// </summary>
  public abstract class AreaRegistration
  {
    private const string TypeCacheName = "MVC-AreaRegistrationTypeCache.xml";

    /// <summary>
    /// Gets the name of the area to register.
    /// </summary>
    /// 
    /// <returns>
    /// The name of the area to register.
    /// </returns>
    public abstract string AreaName { get; }

    internal void CreateContextAndRegister(RouteCollection routes, object state)
    {
      AreaRegistrationContext context = new AreaRegistrationContext(this.AreaName, routes, state);
      string @namespace = this.GetType().Namespace;
      if (@namespace != null)
        context.Namespaces.Add(@namespace + ".*");
      this.RegisterArea(context);
    }

    private static bool IsAreaRegistrationType(Type type)
    {
      if (typeof (AreaRegistration).IsAssignableFrom(type))
        return type.GetConstructor(Type.EmptyTypes) != (ConstructorInfo) null;
      else
        return false;
    }

    /// <summary>
    /// Registers all areas in an ASP.NET MVC application.
    /// </summary>
    public static void RegisterAllAreas()
    {
      AreaRegistration.RegisterAllAreas((object) null);
    }

    /// <summary>
    /// Registers all areas in an ASP.NET MVC application by using the specified user-defined information.
    /// </summary>
    /// <param name="state">An object that contains user-defined information to pass to the area.</param>
    public static void RegisterAllAreas(object state)
    {
      AreaRegistration.RegisterAllAreas(RouteTable.Routes, (IBuildManager) new BuildManagerWrapper(), state);
    }

    internal static void RegisterAllAreas(RouteCollection routes, IBuildManager buildManager, object state)
    {
      foreach (Type type in TypeCacheUtil.GetFilteredTypesFromAssemblies("MVC-AreaRegistrationTypeCache.xml", new Predicate<Type>(AreaRegistration.IsAreaRegistrationType), buildManager))
        ((AreaRegistration) Activator.CreateInstance(type)).CreateContextAndRegister(routes, state);
    }

    /// <summary>
    /// Registers an area in an ASP.NET MVC application using the specified area's context information.
    /// </summary>
    /// <param name="context">Encapsulates the information that is required in order to register the area.</param>
    public abstract void RegisterArea(AreaRegistrationContext context);
  }
}
