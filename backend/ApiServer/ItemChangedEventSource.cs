using System;

public class EventSource
{
  public static event Action Event;

  public static void Dispatch()
  {
    Event();
  }

  public static Action Subscribe(Action Listener)
  {
    Event += Listener;
    return () => Event -= Listener;
  }
}

public class OnItemChanged : EventSource { }