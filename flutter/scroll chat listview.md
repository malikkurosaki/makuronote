```dart
if(_scrollController.position.maxScrollExtent > 0) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent + 70,
          duration: Duration(milliseconds: 500),
          curve: Curves.ease,
        );
      }
      ```
