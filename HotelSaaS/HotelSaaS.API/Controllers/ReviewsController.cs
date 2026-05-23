using HotelSaaS.API.Common;
using HotelSaaS.API.Data;
using HotelSaaS.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelSaaS.API.Controllers;

public class ReviewsController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public ReviewsController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] Guid? hotelId, CancellationToken cancellationToken)
    {
        var query = _context.Reviews.Include(r => r.Guest).Where(r => r.IsPublished);
        if (hotelId.HasValue) query = query.Where(r => r.HotelId == hotelId.Value);
        return OkResponse(await query.OrderByDescending(r => r.CreatedAt).ToListAsync(cancellationToken));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var review = await _context.Reviews.Include(r => r.Guest)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken)
            ?? throw ApiException.NotFound("Review not found");
        return OkResponse(review);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest dto, CancellationToken cancellationToken)
    {
        if (dto.Rating is < 1 or > 5)
            throw ApiException.BadRequest("Rating must be between 1 and 5");

        var review = new Review
        {
            HotelId = dto.HotelId,
            GuestId = dto.GuestId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedBy = CurrentUserId
        };
        await _context.Reviews.AddAsync(review, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return CreatedResponse(review);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateReviewRequest dto, CancellationToken cancellationToken)
    {
        var review = await _context.Reviews.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Review not found");

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;
        review.IsPublished = dto.IsPublished;
        review.UpdatedBy = CurrentUserId;
        review.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse(review);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = PolicyNames.ManagerOrAbove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var review = await _context.Reviews.FindAsync(new object[] { id }, cancellationToken)
            ?? throw ApiException.NotFound("Review not found");
        review.IsDeleted = true;
        review.DeletedBy = CurrentUserId;
        review.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
        return OkResponse("Review deleted");
    }
}

public class CreateReviewRequest
{
    public Guid HotelId { get; set; }
    public Guid GuestId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsPublished { get; set; } = true;
}
