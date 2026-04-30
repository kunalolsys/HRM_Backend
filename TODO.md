# TODO: Socket Implementation for Goal Item Conversations

## Phase 1: Enhance Socket Service ✓
- [x] Add socket import and getIO function
- [x] Emit real-time events when messages are sent
- [x] Emit notifications for goal status changes

## Phase 2: Update myGoals Service - To be integrated when needed
- [ ] Integrate socket when user adds comment
- [ ] Emit notification when goals submitted

## Phase 3: Update teamGoals Service - To be integrated when needed
- [ ] Integrate socket when manager adds remark
- [ ] Emit notifications for approve/send back actions

## Phase 4: Add API Routes ✓
- [x] Add routes for goal conversations
- [x] Create conversation when user accesses goal

## Completed Features:
- Real-time messaging between manager and goal user
- Notification system for goal status changes (approved, sent back, submitted)
- Conversation management per goal item
- Message read tracking

## Socket Events (Client Side):
```javascript
// Connect and register
socket.emit("register", userId);

// Join conversation room
socket.emit("join_conversation", conversationId);

// Listen for new messages
socket.on("new_message", (message) => {
  console.log("New message:", message);
});

// Listen for notifications
socket.on("notification", (notification) => {
  console.log("New notification:", notification);
});

// Send message via API
// POST /api/conversation/message
// Body: { conversationId, text }
```

## API Endpoints:
- GET /api/conversation/goal?goalId=&myGoalId= - Get/create conversation
- POST /api/conversation/message - Send message
- GET /api/conversation/:conversationId/messages - Get messages
- GET /api/conversation/notifications - Get notifications
- PUT /api/conversation/notifications/:notificationId/read - Mark as read
