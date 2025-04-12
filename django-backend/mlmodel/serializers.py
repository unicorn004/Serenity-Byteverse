from rest_framework import serializers

class TestInputSerializer(serializers.Serializer):
    data = serializers.ListField(child=serializers.FloatField(), required=True)