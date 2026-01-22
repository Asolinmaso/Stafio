// utils/sessionManager.js
// Centralized session management for multi-tab, multi-user login

/**
 * Generate or retrieve unique tab ID
 */
export const getOrCreateTabId = () => {
  let tabId = sessionStorage.getItem("tab_id");
  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("tab_id", tabId);
  }
  return tabId;
};

/**
 * Save session for current tab
 */
export const saveSession = (userData, role) => {
  const tabId = getOrCreateTabId();
  
  // Store in sessionStorage (tab-specific)
  sessionStorage.setItem("current_user_id", userData.user_id);
  sessionStorage.setItem("current_username", userData.username);
  sessionStorage.setItem("current_role", role);
  sessionStorage.setItem("current_email", userData.email || "");
  
  // Track all active sessions in localStorage
  let allSessions = JSON.parse(localStorage.getItem("all_active_sessions") || "[]");
  
  // Remove any existing session for this tab
  allSessions = allSessions.filter(s => s.tab_id !== tabId);
  
  // Add new session
  allSessions.push({
    tab_id: tabId,
    user_id: userData.user_id,
    username: userData.username,
    role: role,
    email: userData.email || "",
    login_time: new Date().toISOString()
  });
  
  localStorage.setItem("all_active_sessions", JSON.stringify(allSessions));
};

/**
 * Get current tab's session
 */
export const getCurrentSession = () => {
  const user_id = sessionStorage.getItem("current_user_id");
  const username = sessionStorage.getItem("current_username");
  const role = sessionStorage.getItem("current_role");
  const email = sessionStorage.getItem("current_email");
  
  if (!user_id) return null;
  
  return { user_id, username, role, email };
};

/**
 * Check if user is logged in current tab
 */
export const isLoggedIn = () => {
  return sessionStorage.getItem("current_user_id") !== null;
};

/**
 * Get all active sessions across all tabs
 */
export const getAllActiveSessions = () => {
  return JSON.parse(localStorage.getItem("all_active_sessions") || "[]");
};

/**
 * Logout current tab
 */
export const logoutCurrentTab = () => {
  const tabId = sessionStorage.getItem("tab_id");
  
  // Clear sessionStorage
  sessionStorage.removeItem("current_user_id");
  sessionStorage.removeItem("current_username");
  sessionStorage.removeItem("current_role");
  sessionStorage.removeItem("current_email");
  
  // Remove from all_active_sessions
  let allSessions = JSON.parse(localStorage.getItem("all_active_sessions") || "[]");
  allSessions = allSessions.filter(s => s.tab_id !== tabId);
  localStorage.setItem("all_active_sessions", JSON.stringify(allSessions));
};

/**
 * ✅ IMPROVED: Save Remember Me credentials per user
 */
export const saveRememberMe = (identifier, password, role, userId) => {
  const rememberKey = `remember_${role}_${userId}`;
  const rememberData = {
    email: identifier,
    password: password,
    userId: userId,
    savedAt: new Date().toISOString()
  };
  
  localStorage.setItem(rememberKey, JSON.stringify(rememberData));
  
  // Keep track of all remembered accounts for this role
  let rememberedAccounts = JSON.parse(
    localStorage.getItem(`remembered_${role}_accounts`) || "[]"
  );
  
  // Remove existing entry for this user
  rememberedAccounts = rememberedAccounts.filter(acc => acc.userId !== userId);
  
  // Add new entry
  rememberedAccounts.push({
    userId: userId,
    email: identifier,
    savedAt: new Date().toISOString()
  });
  
  localStorage.setItem(
    `remembered_${role}_accounts`, 
    JSON.stringify(rememberedAccounts)
  );
};

/**
 * ✅ IMPROVED: Get all remembered accounts for a role
 */
export const getAllRememberedAccounts = (role) => {
  return JSON.parse(
    localStorage.getItem(`remembered_${role}_accounts`) || "[]"
  );
};

/**
 * ✅ IMPROVED: Get specific user's Remember Me credentials
 */
export const getRememberMe = (role) => {
  const rememberedAccounts = getAllRememberedAccounts(role);
  if (!rememberedAccounts.length) return null;

  rememberedAccounts.sort(
    (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
  );

  const { userId } = rememberedAccounts[0];
  if (!userId) return null;

  const data = localStorage.getItem(`remember_${role}_${userId}`);
  return data ? JSON.parse(data) : null;
};


/**
 * ✅ IMPROVED: Clear specific user's Remember Me credentials
 */
export const clearRememberMe = (role, userId = null) => {
  if (userId) {
    // Clear specific user
    const rememberKey = `remember_${role}_${userId}`;
    localStorage.removeItem(rememberKey);
    
    // Remove from tracked accounts
    let rememberedAccounts = getAllRememberedAccounts(role);
    rememberedAccounts = rememberedAccounts.filter(acc => acc.userId !== userId);
    localStorage.setItem(
      `remembered_${role}_accounts`, 
      JSON.stringify(rememberedAccounts)
    );
  } else {
    // Clear all for this role
    const rememberedAccounts = getAllRememberedAccounts(role);
    rememberedAccounts.forEach(acc => {
      localStorage.removeItem(`remember_${role}_${acc.userId}`);
    });
    localStorage.removeItem(`remembered_${role}_accounts`);
  }
};

/**
 * ✅ NEW: Save Google Remember Me
 */
export const saveGoogleRememberMe = (email, name, role, userId) => {
  const rememberKey = `remember_google_${role}_${userId}`;
  const rememberData = {
    email: email,
    name: name,
    userId: userId,
    isGoogle: true,
    savedAt: new Date().toISOString()
  };
  
  localStorage.setItem(rememberKey, JSON.stringify(rememberData));
  
  // Track in remembered accounts
  let rememberedAccounts = getAllRememberedAccounts(role);
  rememberedAccounts = rememberedAccounts.filter(acc => acc.userId !== userId);
  rememberedAccounts.push({
    userId: userId,
    email: email,
    isGoogle: true,
    savedAt: new Date().toISOString()
  });
  
  localStorage.setItem(
    `remembered_${role}_accounts`, 
    JSON.stringify(rememberedAccounts)
  );
};

/**
 * Cleanup expired sessions (call on app init)
 */
export const cleanupExpiredSessions = () => {
  let allSessions = JSON.parse(localStorage.getItem("all_active_sessions") || "[]");
  
  // Remove sessions older than 24 hours
  const now = new Date().getTime();
  allSessions = allSessions.filter(session => {
    const loginTime = new Date(session.login_time).getTime();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    return hoursDiff < 24;
  });
  
  localStorage.setItem("all_active_sessions", JSON.stringify(allSessions));
  
  // Also cleanup old remembered accounts (older than 30 days)
  ['admin', 'employee'].forEach(role => {
    let rememberedAccounts = getAllRememberedAccounts(role);
    rememberedAccounts = rememberedAccounts.filter(acc => {
      const savedTime = new Date(acc.savedAt).getTime();
      const daysDiff = (now - savedTime) / (1000 * 60 * 60 * 24);
      return daysDiff < 30;
    });
    localStorage.setItem(
      `remembered_${role}_accounts`, 
      JSON.stringify(rememberedAccounts)
    );
  });
};