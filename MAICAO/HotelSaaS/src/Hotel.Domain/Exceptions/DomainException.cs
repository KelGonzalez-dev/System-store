namespace Hotel.Domain.Exceptions;

public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message) { }
    protected DomainException(string message, Exception inner) : base(message, inner) { }
}

public class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string entityName, object id)
        : base($"{entityName} with ID '{id}' was not found.") { }
}

public class RoomNotAvailableException : DomainException
{
    public RoomNotAvailableException(string roomId, DateOnly checkIn, DateOnly checkOut)
        : base($"Room '{roomId}' is not available from {checkIn} to {checkOut}.") { }
}

public class InvalidReservationStatusException : DomainException
{
    public InvalidReservationStatusException(string current, string attempted)
        : base($"Cannot transition from status '{current}' to '{attempted}'.") { }
}

public class DuplicatePaymentException : DomainException
{
    public DuplicatePaymentException(string idempotencyKey)
        : base($"Payment with idempotency key '{idempotencyKey}' already exists.") { }
}

public class InsufficientPaymentException : DomainException
{
    public InsufficientPaymentException(decimal required, decimal paid)
        : base($"Insufficient payment. Required: {required}, Paid: {paid}.") { }
}

public class OptimisticConcurrencyException : DomainException
{
    public OptimisticConcurrencyException(string entityName)
        : base($"Concurrency conflict on {entityName}. Please retry.") { }
}

public class HoldExpiredException : DomainException
{
    public HoldExpiredException(string holdId)
        : base($"Hold '{holdId}' has expired.") { }
}

public class TenantNotFoundException : DomainException
{
    public TenantNotFoundException(string tenantId)
        : base($"Tenant '{tenantId}' not found.") { }
}

public class UnauthorizedTenantAccessException : DomainException
{
    public UnauthorizedTenantAccessException()
        : base("You are not authorized to access resources of this tenant.") { }
}
