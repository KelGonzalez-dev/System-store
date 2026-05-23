using FluentValidation;
using Hotel.Domain.Exceptions;
using Hotel.Shared.Models;
using System.Net;
using System.Text.Json;

namespace Hotel.Api.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    { _next = next; _logger = logger; }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(ctx, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext ctx, Exception ex)
    {
        var traceId = ctx.TraceIdentifier;
        var (statusCode, message, errors) = ex switch
        {
            ValidationException ve => (
                HttpStatusCode.BadRequest,
                "Validation failed.",
                ve.Errors.Select(e => e.ErrorMessage).ToList()),
            EntityNotFoundException or NotFoundException nfe => (
                HttpStatusCode.NotFound,
                ex.Message,
                new List<string>()),
            UnauthorizedAccessException => (
                HttpStatusCode.Unauthorized,
                ex.Message,
                new List<string>()),
            ForbiddenAccessException => (
                HttpStatusCode.Forbidden,
                ex.Message,
                new List<string>()),
            RoomNotAvailableException or InvalidReservationStatusException
                or DuplicatePaymentException or HoldExpiredException
                or OptimisticConcurrencyException => (
                HttpStatusCode.Conflict,
                ex.Message,
                new List<string>()),
            InvalidOperationException => (
                HttpStatusCode.BadRequest,
                ex.Message,
                new List<string>()),
            _ => (
                HttpStatusCode.InternalServerError,
                "An unexpected error occurred.",
                new List<string>())
        };

        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(ex, "Unhandled exception. TraceId: {TraceId}", traceId);
        else
            _logger.LogWarning(ex, "Handled exception {Type}. TraceId: {TraceId}", ex.GetType().Name, traceId);

        ctx.Response.ContentType = "application/json";
        ctx.Response.StatusCode = (int)statusCode;

        var response = new ApiResponse
        {
            Success = false,
            Message = message,
            Errors = errors,
            TraceId = traceId
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        await ctx.Response.WriteAsync(json);
    }
}