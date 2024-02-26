using System;

namespace Events;

public class EventSource
{
  public static event Action Event;

  public static void Dispatch()
  {
    if (Event is not null)
    {
      Event.Invoke();
    }
  }

  public static Action Subscribe(Action Listener)
  {
    Event += Listener;
    return () => Event -= Listener;
  }
}

public class OnItemsChanged : EventSource { }