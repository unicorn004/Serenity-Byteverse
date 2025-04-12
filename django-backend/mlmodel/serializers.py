from rest_framework import serializers

class TestInputSerializer(serializers.Serializer):
    data = serializers.ListField(child=serializers.FloatField(), required=True)


class ChatInputSerializer(serializers.Serializer):
    user_input = serializers.CharField(required=True)

class ChatOutputSerializer(serializers.Serializer):
    response = serializers.CharField()