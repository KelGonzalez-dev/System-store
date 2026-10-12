using System.Net;
using System.Net.Http.Json;
using Hotel.Application.Features.Auth.DTOs;
using Hotel.Shared.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using FluentAssertions;

namespace Hotel.IntegrationTests;

// NOTE: Integration tests require a running PostgreSQL + Redis
// Use docker-compose up postgres redis before running
public class AuthEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AuthEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact(Skip = "Requires live database")]
    public async Task Post_Login_ValidCredentials_Returns200WithToken()
    {
        var request = new LoginRequest("superadmin@hotelsaas.io", "Admin1234!");
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LoginResponse>>();
        body.Should().NotBeNull();
        body!.Success.Should().BeTrue();
        body.Data!.AccessToken.Should().NotBeNullOrEmpty();
    }

    [Fact(Skip = "Requires live database")]
    public async Task Post_Login_InvalidCredentials_Returns401()
    {
        var request = new LoginRequest("superadmin@hotelsaas.io", "WrongPassword!");
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", request);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}