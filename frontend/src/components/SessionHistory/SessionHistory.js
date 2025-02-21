// SessionHistory.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import { supabase } from '../../supabase';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    try {
      // Get all messages grouped by session_id
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by session_id and get first message
      const sessionMap = data.reduce((acc, message) => {
        if (!acc[message.session_id]) {
          acc[message.session_id] = {
            id: message.session_id,
            date: new Date(message.created_at),
            firstMessage: message.content,
            sender: message.sender
          };
        }
        return acc;
      }, {});

      setSessions(Object.values(sessionMap));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    console.log('Attempting to delete session:', sessionId);
    try {
        // Let's first check if messages exist for this session
        const { data: messagesToDelete, error: checkError } = await supabase
            .from('messages')
            .select('id')
            .eq('session_id', sessionId)
            .eq('user_id', user.id);

        console.log('Messages to delete:', messagesToDelete);

        if (checkError) {
            console.error('Error checking messages:', checkError);
            return;
        }

        const { data, error } = await supabase
            .from('messages')
            .delete()
            .eq('session_id', sessionId)
            .eq('user_id', user.id);

        if (error) {
            console.error('Delete error:', error);
            return;
        }

        console.log('Delete response:', data);
        fetchSessions();
    } catch (error) {
        console.error('Error in delete operation:', error);
    }
};

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="history-content">
      <h2>Past Sessions</h2>
      <div className="sessions-list">
        {sessions.map((session) => (
          <div key={session.id} className="session-item">
            <div className="session-header">
              <span className="session-date">{formatDate(session.date)}</span>
              <button 
                onClick={() => handleDeleteSession(session.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
            <p className="session-preview">
              {session.sender === 'user' ? 'You: ' : ''}{session.firstMessage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionHistory;