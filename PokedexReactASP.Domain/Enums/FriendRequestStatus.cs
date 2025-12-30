namespace PokedexReactASP.Domain.Enums
{
    /// <summary>
    /// Status of a friend request
    /// </summary>
    public enum FriendRequestStatus
    {
        /// <summary>
        /// Request is waiting for response
        /// </summary>
        Pending = 0,

        /// <summary>
        /// Request was accepted
        /// </summary>
        Accepted = 1,

        /// <summary>
        /// Request was declined
        /// </summary>
        Declined = 2,

        /// <summary>
        /// Request was cancelled by sender
        /// </summary>
        Cancelled = 3
    }
}
